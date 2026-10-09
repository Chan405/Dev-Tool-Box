import { csvToJson } from "../src/lib/csv/parse-csv-to-json";
import { jsonToCsv } from "../src/lib/csv/json-to-csv";
import { formatJson } from "../src/lib/json/format-json";
import { decodeJwt } from "../src/lib/jwt/decode-jwt";
import { getJwtExpiration } from "../src/lib/jwt/jwt-expiration";
import { jsonToTypescript } from "../src/lib/typescript/json-to-typescript";
import { jsonToZod } from "../src/lib/zod/json-to-zod";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const sample = `{"name":"Chan","age":25,"active":true}`;

const formatted = formatJson(sample);
assert(formatted.ok, "formatJson should succeed");
assert(formatted.ok && formatted.output.includes('"name": "Chan"'), "formatJson pretty output");

const ts = jsonToTypescript(sample, "Root");
assert(ts.ok, "jsonToTypescript should succeed");
assert(ts.ok && ts.output.includes("interface Root"), "jsonToTypescript interface");

const zod = jsonToZod(sample, "RootSchema");
assert(zod.ok, "jsonToZod should succeed");
assert(zod.ok && zod.output.includes("z.object"), "zod schema");

const nested = jsonToZod(
  `{"id":123,"profile":{"active":true}}`,
  "RootSchema",
);
assert(nested.ok, "nested jsonToZod should succeed");
assert(
  nested.ok && nested.output.indexOf("const RootSchemaProfileSchema") < nested.output.indexOf("const RootSchema "),
  "nested zod schema is declared before the root schema that references it",
);

const csv = `name,age\nAlice,25\nBob,30`;
const csvJson = csvToJson(csv, { useFirstRowAsHeaders: true });
assert(csvJson.ok, "csvToJson should succeed");
assert(csvJson.ok && csvJson.output.includes("Alice"), "csv json rows");

const arrayJson = `[{"name":"Alice","age":25},{"name":"Bob","age":30}]`;
const toCsv = jsonToCsv(arrayJson);
assert(toCsv.ok, "jsonToCsv should succeed");
assert(toCsv.ok && toCsv.output.startsWith("name,age"), "csv header");

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const decoded = decodeJwt(jwt);
assert(decoded.ok, "decodeJwt should succeed");
assert(decoded.ok && decoded.payload.name === "John Doe", "jwt payload name");

const nowMs = Date.UTC(2024, 0, 1);
const nowSeconds = Math.floor(nowMs / 1000);

function unsignedJwt(payload: Record<string, unknown>): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.sig`;
}

const valid = getJwtExpiration(
  unsignedJwt({ exp: nowSeconds + 7200, nbf: nowSeconds - 10, iat: nowSeconds - 20 }),
  nowMs,
);
assert(valid.status === "valid", "jwt exp valid");
assert(valid.secondsRemaining === 7200, "jwt exp seconds remaining");
assert(valid.exp === new Date((nowSeconds + 7200) * 1000).toISOString(), "jwt exp iso");

const expired = getJwtExpiration(unsignedJwt({ exp: nowSeconds - 3600, iat: nowSeconds - 7200 }), nowMs);
assert(expired.status === "expired", "jwt exp expired");
assert(expired.secondsRemaining === -3600, "jwt exp negative remaining");

const notYet = getJwtExpiration(unsignedJwt({ nbf: nowSeconds + 600, exp: nowSeconds + 3600 }), nowMs);
assert(notYet.status === "not-yet-valid", "jwt exp not yet valid");

const noExp = getJwtExpiration(unsignedJwt({ iat: nowSeconds }), nowMs);
assert(noExp.status === "no-exp", "jwt exp missing");
assert(noExp.exp === null, "jwt exp missing value");
assert(noExp.iat === new Date(nowSeconds * 1000).toISOString(), "jwt iat iso");

const stringExp = getJwtExpiration(unsignedJwt({ exp: String(nowSeconds + 100) }), nowMs);
assert(stringExp.status === "invalid-exp", "jwt string exp");
assert(stringExp.secondsRemaining === null, "jwt string exp has no remaining time");

const millisecondExp = getJwtExpiration(unsignedJwt({ exp: (nowSeconds + 100) * 1000 }), nowMs);
assert(millisecondExp.status === "invalid-exp", "jwt millisecond exp");
assert(millisecondExp.message?.includes("milliseconds") === true, "jwt millisecond hint");
assert(millisecondExp.secondsRemaining === null, "jwt millisecond exp is not converted");

const malformed = getJwtExpiration("not-a-jwt", nowMs);
assert(malformed.status === "invalid-token", "jwt malformed token");

function assertTypescript(input: string, expected: string) {
  const result = jsonToTypescript(input, "Root");
  assert(result.ok, `jsonToTypescript should succeed for ${input}`);
  assert(
    result.ok && result.output === expected,
    `jsonToTypescript output mismatch for ${input}\n--- actual ---\n${result.ok ? result.output : ""}\n--- expected ---\n${expected}`,
  );
}

assertTypescript(
  `{"orders":[{"orderId":"a","coupon":"X"},{"orderId":"b"}]}`,
  `interface Root {
  orders: (RootOrdersItem | RootOrdersItem2)[];
}

interface RootOrdersItem {
  orderId: string;
  coupon: string;
}

interface RootOrdersItem2 {
  orderId: string;
}`,
);

assertTypescript(
  `{"items":[{"v":1},{"v":"a"}]}`,
  `interface Root {
  items: (RootItemsItem | RootItemsItem2)[];
}

interface RootItemsItem {
  v: number;
}

interface RootItemsItem2 {
  v: string;
}`,
);

assertTypescript(`[1, "a"]`, `type Root = (number | string)[];`);

assertTypescript(
  `{"x":[1,"a"]}`,
  `interface Root {
  x: (number | string)[];
}`,
);

assertTypescript(
  `{"x":[null,"a"]}`,
  `interface Root {
  x: (null | string)[];
}`,
);

assertTypescript(`[[1],["a"]]`, `type Root = (number[] | string[])[];`);

assertTypescript(
  `{"x":[[1,"a"]]}`,
  `interface Root {
  x: (number | string)[][];
}`,
);

assertTypescript(
  `{"a":[{"id":1},{"id":2}]}`,
  `interface Root {
  a: RootAItem[];
}

interface RootAItem {
  id: number;
}`,
);

console.log("smoke-lib: all checks passed");
