import { csvToJson } from "../src/lib/csv/parse-csv-to-json";
import { jsonToCsv } from "../src/lib/csv/json-to-csv";
import { formatJson } from "../src/lib/json/format-json";
import { decodeJwt } from "../src/lib/jwt/decode-jwt";
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

console.log("smoke-lib: all checks passed");
