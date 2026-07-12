---
title: How to format JSON
description: A practical guide to formatting JSON for debugging, development, and API work.
slug: how-to-format-json
date: 2026-06-08
---
# How to format JSON

Formatting JSON is more than adding line breaks. A good formatting workflow helps you see the shape of an API response, find the field that breaks a test, and share a readable example without changing the data itself. The formatter changes whitespace; it should not silently change values, keys, array order, or data types.

## What valid JSON looks like

JSON has a small set of rules that explain most formatting errors:

- Objects use double-quoted keys and values, with a colon between a key and its value.
- Arrays use square brackets and can contain objects, strings, numbers, booleans, or null.
- Strings must use double quotes. A single quote may be valid in JavaScript source but is not valid JSON.
- JSON does not allow trailing commas after the final object property or array item.
- JSON has no comments, `undefined`, `NaN`, or `Infinity` values.

For example, this compact payload is valid JSON:

`{"user":{"id":42,"roles":["editor","reviewer"]},"active":true}`

After formatting, the nesting becomes visible and the `roles` value is easier to inspect. If a formatter reports an error, read the position in context. The actual problem can be a missing quote or comma several characters before the reported position.

## A reliable formatting workflow

1. Remove accidental prefixes such as `Response:`, log timestamps, or Markdown code fences if the input is meant to be pure JSON.
2. Paste the payload into the [JSON Formatter tool](/en/tools/json-formatter) and format it.
3. Validate the result before using it in a test, ticket, or documentation example.
4. Check sensitive fields such as access tokens, email addresses, internal hostnames, and customer identifiers before sharing the output.
5. If you are investigating a change, compare the formatted versions so that a changed value is not hidden inside one long line.

Formatting is not the same as validation. A formatter can make a valid document readable, but it cannot tell you whether the API returned the right business value or whether a required field is missing from your schema.

## Common debugging cases

When an API client says it received malformed JSON, first check whether the server returned HTML, a proxy error, or an empty response instead of JSON. Then check the response encoding and the first non-whitespace character. An object normally starts with `{`; an array starts with `[`. If a payload works in one environment but not another, compare the actual response bodies rather than only the request code.

For configuration files, format after making a small change and inspect the surrounding object. This catches a misplaced brace and also makes duplicate-looking keys easier to notice. JSON parsers may accept duplicate keys in different ways, so avoid relying on them.

## Privacy and sharing checklist

Do not paste production secrets into a public issue or screenshot. Redact values while keeping the same data type, for example `"token":"REDACTED"` or `"userId":12345`. Preserve the nesting that matters to the bug report, but remove records that are unrelated. If a payload contains personal data, use a fabricated example when possible.

## Final takeaway

Use a formatter to understand structure, a validator to confirm syntax, and your API contract or schema to decide whether the data is correct. That separation makes JSON debugging faster and prevents a readable payload from being mistaken for a verified one.
