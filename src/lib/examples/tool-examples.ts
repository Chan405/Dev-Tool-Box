export const JSON_OBJECT_EXAMPLE = `{
  "name": "Chan",
  "age": 25,
  "active": true
}`;

export const API_RESPONSE_EXAMPLE = `{
  "id": 123,
  "name": "Aye",
  "email": "aye@example.com",
  "roles": ["admin", "user"],
  "profile": {
    "active": true
  }
}`;

export const JSON_ARRAY_EXAMPLE = `[
  {"name":"Alice","age":25},
  {"name":"Bob","age":30}
]`;

export const CSV_EXAMPLE = `name,age,city
Alice,25,"New York, NY"
Bob,30,Chicago`;

export const JWT_EXAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

/** Unsigned sample. exp, nbf, and iat are 2018-01-18T01:30:22.000Z. The signature is not real. */
export const JWT_EXPIRED_EXAMPLE =
  "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJleHAiOjE1MTYyMzkwMjIsIm5iZiI6MTUxNjIzOTAyMiwiaWF0IjoxNTE2MjM5MDIyfQ.sig";
