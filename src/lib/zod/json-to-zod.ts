import { parseJson, formatParseErrorMessage } from "@/lib/json/parse-json";
import { inferFromJsonRoot, type JsonInferredType } from "@/lib/json/infer-json-structure";

export type JsonToZodResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

const DEFAULT_ROOT = "RootSchema";

function sanitizeRootName(name: string): string {
  const trimmed = name.trim();
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(trimmed)) {
    return trimmed;
  }
  return DEFAULT_ROOT;
}

function toPascalCase(segment: string): string {
  const cleaned = segment.replace(/[^a-zA-Z0-9]+/g, " ");
  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 0) {
    return "Item";
  }
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
}

class ZodEmitter {
  private readonly schemas = new Map<string, string>();
  private readonly usedNames = new Set<string>();

  constructor(private readonly rootName: string) {}

  emit(value: unknown): string {
    const inferred = inferFromJsonRoot(value);
    const rootExpr = this.emitType(inferred, this.rootName, "Root");

    const blocks = [...this.schemas.entries()].map(([name, body]) => `const ${name} = ${body};`);

    const lines = ["import { z } from \"zod\";", "", ...blocks];

    if (!this.schemas.has(this.rootName)) {
      lines.push("", `const ${this.rootName} = ${rootExpr};`);
    }

    lines.push("", `export { ${this.rootName} };`, "");

    return lines.join("\n");
  }

  private reserveName(base: string): string {
    let candidate = base;
    let index = 2;
    while (this.usedNames.has(candidate)) {
      candidate = `${base}${index}`;
      index += 1;
    }
    this.usedNames.add(candidate);
    return candidate;
  }

  private registerSchema(name: string, body: string): string {
    if (!this.schemas.has(name)) {
      this.schemas.set(name, body);
    }
    return name;
  }

  private emitType(type: JsonInferredType, nameHint: string, context: string): string {
    switch (type.kind) {
      case "string":
        return "z.string()";
      case "number":
        return "z.number()";
      case "boolean":
        return "z.boolean()";
      case "null":
        return "z.null()";
      case "union": {
        const members = type.members.map((member) => this.emitType(member, nameHint, context));
        if (members.length === 1) {
          return members[0];
        }
        return `z.union([${members.join(", ")}])`;
      }
      case "array": {
        const element = this.emitType(type.element, `${nameHint}Item`, `${context}Item`);
        return `z.array(${element})`;
      }
      case "object": {
        const entries = Object.entries(type.properties);
        if (entries.length === 0) {
          return "z.object({})";
        }
        const baseName = toPascalCase(nameHint) || context;
        const schemaName = this.reserveName(nameHint.endsWith("Schema") ? nameHint : `${baseName}Schema`);
        const shape = entries
          .map(([key, prop]) => {
            let expr = this.emitType(prop.type, `${schemaName}${toPascalCase(key)}`, toPascalCase(key));
            if (prop.optional) {
              expr = `${expr}.optional()`;
            }
            return `  ${key}: ${expr},`;
          })
          .join("\n");
        const body = `z.object({\n${shape}\n})`;
        this.registerSchema(schemaName, body);
        return schemaName;
      }
      default:
        return "z.unknown()";
    }
  }
}

export function jsonToZod(input: string, rootName = DEFAULT_ROOT): JsonToZodResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return { ok: false, error: formatParseErrorMessage(parsed.error, "convert JSON to Zod") };
  }

  const value = parsed.value;
  if (typeof value !== "object" || value === null) {
    return {
      ok: false,
      error: "JSON must be an object or array to generate a Zod schema.",
    };
  }

  const safeRoot = sanitizeRootName(rootName);
  const emitter = new ZodEmitter(safeRoot);

  return { ok: true, output: emitter.emit(value).trimEnd() };
}
