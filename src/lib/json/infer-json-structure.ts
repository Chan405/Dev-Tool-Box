export type JsonInferredType =
  | { kind: "string" }
  | { kind: "number" }
  | { kind: "boolean" }
  | { kind: "null" }
  | { kind: "array"; element: JsonInferredType }
  | { kind: "object"; properties: Record<string, JsonInferredProperty> }
  | { kind: "union"; members: JsonInferredType[] };

export type JsonInferredProperty = {
  type: JsonInferredType;
  optional: boolean;
};

function typeKey(type: JsonInferredType): string {
  switch (type.kind) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    case "array":
      return `array<${typeKey(type.element)}>`;
    case "object": {
      const props = Object.entries(type.properties)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, prop]) => `${key}${prop.optional ? "?" : ""}:${typeKey(prop.type)}`)
        .join(",");
      return `object{${props}}`;
    }
    case "union":
      return `union(${type.members.map(typeKey).sort().join("|")})`;
    default:
      return "unknown";
  }
}

function dedupeUnionMembers(members: JsonInferredType[]): JsonInferredType[] {
  const seen = new Set<string>();
  const result: JsonInferredType[] = [];

  for (const member of members) {
    const key = typeKey(member);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(member);
  }

  return result;
}

function flattenUnion(type: JsonInferredType): JsonInferredType[] {
  if (type.kind === "union") {
    return type.members.flatMap(flattenUnion);
  }
  return [type];
}

export function mergeInferredTypes(types: JsonInferredType[]): JsonInferredType {
  const flat = dedupeUnionMembers(types.flatMap(flattenUnion));

  if (flat.length === 0) {
    return { kind: "null" };
  }
  if (flat.length === 1) {
    return flat[0];
  }

  return { kind: "union", members: flat };
}

export function inferFromValue(value: unknown): JsonInferredType {
  if (value === null) {
    return { kind: "null" };
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { kind: "array", element: { kind: "null" } };
    }
    return { kind: "array", element: mergeInferredTypes(value.map(inferFromValue)) };
  }
  switch (typeof value) {
    case "string":
      return { kind: "string" };
    case "number":
      return { kind: "number" };
    case "boolean":
      return { kind: "boolean" };
    case "object": {
      const record = value as Record<string, unknown>;
      const properties: Record<string, JsonInferredProperty> = {};
      for (const [key, child] of Object.entries(record)) {
        properties[key] = { type: inferFromValue(child), optional: false };
      }
      return { kind: "object", properties };
    }
    default:
      return { kind: "null" };
  }
}

export function mergeObjectInferredTypes(objects: JsonInferredType[]): JsonInferredType {
  const objectTypes = objects.filter((type): type is Extract<JsonInferredType, { kind: "object" }> => type.kind === "object");

  if (objectTypes.length === 0) {
    return mergeInferredTypes(objects);
  }

  const keys = new Set<string>();
  for (const objectType of objectTypes) {
    for (const key of Object.keys(objectType.properties)) {
      keys.add(key);
    }
  }

  const properties: Record<string, JsonInferredProperty> = {};

  for (const key of keys) {
    const presentTypes: JsonInferredType[] = [];
    let presentCount = 0;

    for (const objectType of objectTypes) {
      const prop = objectType.properties[key];
      if (prop) {
        presentCount += 1;
        presentTypes.push(prop.type);
      }
    }

    properties[key] = {
      type: mergeInferredTypes(presentTypes),
      optional: presentCount < objectTypes.length,
    };
  }

  return { kind: "object", properties };
}

export function inferFromJsonRoot(value: unknown): JsonInferredType {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { kind: "array", element: { kind: "null" } };
    }
    const elementTypes = value.map((item) => inferFromValue(item));
    const objectItems = elementTypes.filter((type) => type.kind === "object");
    const element =
      objectItems.length === value.length ? mergeObjectInferredTypes(objectItems) : mergeInferredTypes(elementTypes);
    return { kind: "array", element };
  }

  return inferFromValue(value);
}
