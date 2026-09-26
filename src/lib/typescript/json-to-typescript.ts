import { parseJson, formatParseErrorMessage } from "@/lib/json/parse-json";
import { inferFromJsonRoot, type JsonInferredType } from "@/lib/json/infer-json-structure";

export type JsonToTypescriptResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

const DEFAULT_ROOT = "Root";

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

function isNamedObject(type: JsonInferredType): type is Extract<JsonInferredType, { kind: "object" }> {
  return type.kind === "object" && Object.keys(type.properties).length > 0;
}

class TypescriptEmitter {
  private readonly interfaces = new Map<string, string>();
  private readonly usedNames = new Set<string>();

  constructor(private readonly rootName: string) {}

  emit(value: unknown): string {
    const inferred = inferFromJsonRoot(value);
    const rootType = this.emitType(inferred, this.rootName, "Root");

    const blocks = [...this.interfaces.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, body]) => `interface ${name} {\n${body}\n}`);

    if (this.interfaces.has(this.rootName)) {
      return `${blocks.join("\n\n")}\n`;
    }

    if (blocks.length === 0) {
      return `type ${this.rootName} = ${rootType};\n`;
    }

    return `${blocks.join("\n\n")}\n\ntype ${this.rootName} = ${rootType};\n`;
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

  private registerInterface(name: string, body: string): string {
    if (!this.interfaces.has(name)) {
      this.interfaces.set(name, body);
    }
    return name;
  }

  private emitType(type: JsonInferredType, nameHint: string, context: string): string {
    switch (type.kind) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
      case "null":
        return "null";
      case "union":
        return type.members.map((member) => this.emitType(member, nameHint, context)).join(" | ");
      case "array": {
        const element = this.emitType(type.element, `${nameHint}Item`, `${context}Item`);
        return `${element}[]`;
      }
      case "object": {
        if (!isNamedObject(type)) {
          return "Record<string, never>";
        }
        const interfaceName = this.reserveName(toPascalCase(nameHint) || context);
        const body = Object.entries(type.properties)
          .map(([key, prop]) => {
            const optional = prop.optional ? "?" : "";
            const propType = this.emitType(prop.type, `${interfaceName}${toPascalCase(key)}`, toPascalCase(key));
            return `  ${key}${optional}: ${propType};`;
          })
          .join("\n");
        this.registerInterface(interfaceName, body);
        return interfaceName;
      }
      default:
        return "unknown";
    }
  }
}

export function jsonToTypescript(input: string, rootName = DEFAULT_ROOT): JsonToTypescriptResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    return { ok: false, error: formatParseErrorMessage(parsed.error, "convert JSON to TypeScript") };
  }

  const value = parsed.value;
  if (typeof value !== "object" || value === null) {
    return {
      ok: false,
      error: "JSON must be an object or array to generate TypeScript types.",
    };
  }

  const safeRoot = sanitizeRootName(rootName);
  const emitter = new TypescriptEmitter(safeRoot);
  const output = emitter.emit(value).trimEnd();

  return { ok: true, output };
}
