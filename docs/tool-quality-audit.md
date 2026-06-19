# Tool Quality Audit

Date: 2026-06-18

This audit uses a product-first rule: prefer improving, merging, or repositioning weak tools before removing them. "Sunset" is reserved for tools that are misleading, duplicate a better experience, or create avoidable trust/compliance risk.

## A/B/C Classification

| Class | Meaning | Default treatment |
| --- | --- | --- |
| A | Keep and polish as a first-class destination. | Improve UX, examples, downloads, history/presets, and tests. |
| B | Keep the page, but upgrade algorithm depth before pushing harder. | Replace heuristic logic with libraries/parsers and add edge-case tests. |
| C | Useful capability, but too small or overlapping as a standalone page. | Merge into a broader toolbox while keeping route/SEO continuity where useful. |

No current tool is marked for immediate removal. "Sunset" stays available as a future governance status, but the default posture is to optimize before hiding or deleting.

## Current Class Index

### A: Keep And Polish

json-formatter, json-validator, json-to-typescript, jwt-decoder, uuid-generator, base64, url-encoder, timestamp, markdown-preview, json-diff, json-escape, regex-tester, hash-generator, color-converter, password-generator, slug-generator, qr-code-generator, html-encoder, url-parser, query-string-parser, query-string-builder, http-header-parser, bmi-calculator, sleep-calculator.

### B: Improve Algorithms Or Trust Depth

html-formatter, yaml-formatter, xml-formatter, sql-formatter, cron-generator, css-formatter, js-formatter, text-diff, csv-to-json, json-to-csv, json-to-yaml, yaml-to-json, env-to-json, json-to-env, toml-to-json, user-agent-parser, html-stripper, markdown-to-text, zodiac-compatibility, birthday-five-elements, calorie-calculator, financial-goal-calculator, retirement-calculator.

### C: Merge Into Broader Toolboxes

word-counter, character-counter, case-converter, text-cleaner, line-sorter, line-deduplicator, empty-line-remover, whitespace-normalizer, email-extractor, url-extractor, number-extractor, unicode-escape, unicode-unescape, hex-to-text, text-to-hex, binary-to-text, text-to-binary, reading-time, lorem-ipsum, list-randomizer.

## Quality Tiers

| Tier | Meaning | Action |
| --- | --- | --- |
| Keep | Useful enough to remain a first-class page. | Polish UX, add tests, track usage. |
| Improve | Good search intent, but implementation is too thin or brittle. | Upgrade parser/formatter/library and add examples. |
| Merge | Small utility that is useful, but not strong enough as a standalone destination. | Keep route for SEO if needed, but unify UI into a broader toolbox. |
| Sunset | Low trust, poor fit, or risky to present as a standalone utility. | Hide from navigation first; keep redirect or noindex plan before removal. |

## Tool Decisions

| Slug | Decision | Rationale | Next action |
| --- | --- | --- | --- |
| json-formatter | Keep | High-intent developer tool; already functional. | Add edge-case tests and better error location. |
| json-validator | Keep | Clear standalone job. | Share parser diagnostics with formatter. |
| json-to-typescript | Keep | Valuable developer workflow. | Improve array/object inference and optional fields. |
| jwt-decoder | Keep | High-value debugging tool. | Add signature metadata and expiration warnings. |
| uuid-generator | Keep | Simple but useful. | Add v1/v7 options only if demand appears. |
| base64 | Keep | Core utility with Unicode-safe implementation. | Add file/binary mode later. |
| url-encoder | Keep | Core web utility. | Add component vs full URL mode. |
| timestamp | Keep | Common developer task. | Add timezone presets and copy formats. |
| markdown-preview | Keep | Real interactive workflow. | Add sanitize/export tests. |
| html-formatter | Improve | Useful, but current formatter is heuristic. | Replace with parser/Prettier-backed formatting. |
| json-diff | Keep | Useful workflow with visible output. | Add deep/object mode options and tests. |
| json-escape | Keep | Small but clear developer task. | Add unescape mode. |
| yaml-formatter | Improve | Search intent is real, implementation only trims/validates indentation. | Use a YAML parser/formatter. |
| xml-formatter | Improve | Useful, but formatter is browser-DOM plus simple indentation. | Add robust parse errors and tests. |
| sql-formatter | Improve | High-intent, but hand formatter is brittle. | Use a SQL formatter library. |
| regex-tester | Keep | Real interactive workflow. | Add flags validation, match navigation, tests. |
| cron-generator | Improve | Useful, but only supports narrow expressions. | Add presets, validation, next-run engine. |
| hash-generator | Keep | Browser crypto implementation is useful. | Add HMAC and file hash later. |
| color-converter | Keep | Useful visual utility. | Add HSL/HSV/alpha and contrast checks. |
| password-generator | Keep | Useful, uses crypto randomness. | Add strength estimate and avoid modulo bias. |
| word-counter | Merge | Useful but too small alone. | Fold into text statistics toolbox. |
| character-counter | Merge | Useful but overlaps word counter. | Fold into text statistics toolbox. |
| case-converter | Merge | Useful but lightweight. | Fold into text transform toolbox. |
| text-cleaner | Merge | Useful but generic. | Fold into text transform toolbox. |
| slug-generator | Keep | Clear SEO/dev workflow. | Add locale/transliteration options. |
| qr-code-generator | Keep | Strong standalone utility. | Add PNG download and style controls. |
| html-encoder | Keep | Clear developer task. | Add decode mode. |
| css-formatter | Improve | Current formatter is brace splitting. | Use Prettier/parser-backed formatting. |
| js-formatter | Improve | Current formatter is brace splitting. | Use Prettier/parser-backed formatting. |
| url-parser | Keep | Clear web utility. | Add query table editor. |
| line-sorter | Merge | Useful list operation, weak standalone. | Fold into list tools. |
| line-deduplicator | Merge | Useful list operation, weak standalone. | Fold into list tools. |
| empty-line-remover | Merge | Useful text operation, weak standalone. | Fold into text cleaner. |
| whitespace-normalizer | Merge | Useful text operation, weak standalone. | Fold into text cleaner. |
| text-diff | Improve | Search intent is real, current diff is too naive. | Use real line/word diff algorithm. |
| email-extractor | Merge | Useful extraction task, narrow standalone. | Fold into extractor toolbox. |
| url-extractor | Merge | Useful extraction task, narrow standalone. | Fold into extractor toolbox. |
| number-extractor | Merge | Useful extraction task, narrow standalone. | Fold into extractor toolbox. |
| csv-to-json | Improve | High-intent converter; parser must handle quotes. | Add parser tests and download options. |
| json-to-csv | Improve | High-intent converter; needs CSV escaping. | Add escaping and nested-field handling. |
| json-to-yaml | Improve | Useful converter, current output is shallow. | Use YAML serializer. |
| yaml-to-json | Improve | Useful converter, current parser is shallow. | Use YAML parser. |
| env-to-json | Improve | Useful developer task; needs comments/quotes support. | Add parser rules and tests. |
| json-to-env | Improve | Useful developer task; needs escaping rules. | Add quote/escape options. |
| toml-to-json | Improve | Useful but current parser is shallow. | Use TOML parser. |
| query-string-parser | Keep | Clear web task. | Add repeated-key handling. |
| query-string-builder | Keep | Clear web task. | Add array/repeated-key options. |
| http-header-parser | Keep | Useful debugging task. | Add raw request/response parsing. |
| user-agent-parser | Improve | Useful, but UA parsing by regex ages quickly. | Use maintained parser data/library. |
| unicode-escape | Merge | Useful but small. | Fold into encoding toolbox. |
| unicode-unescape | Merge | Useful but small. | Fold into encoding toolbox. |
| hex-to-text | Merge | Useful but small. | Fold into encoding toolbox. |
| text-to-hex | Merge | Useful but small. | Fold into encoding toolbox. |
| binary-to-text | Merge | Useful but small. | Fold into encoding toolbox. |
| text-to-binary | Merge | Useful but small. | Fold into encoding toolbox. |
| html-stripper | Improve | Useful, but regex stripping is unsafe for real HTML. | Use DOM/parser-based extraction. |
| markdown-to-text | Improve | Useful, but regex loses many Markdown cases. | Use Markdown parser AST. |
| reading-time | Merge | Useful but tiny. | Fold into writing/statistics toolbox. |
| lorem-ipsum | Merge | Useful generator, low standalone depth. | Fold into writing generators. |
| list-randomizer | Merge | Useful list operation, weak standalone. | Fold into list tools. |
| zodiac-compatibility | Improve | Traffic-friendly, but needs clearer entertainment framing. | Keep disclaimer and richer structured UI. |
| birthday-five-elements | Improve | Cultural/entertainment tool; trust-sensitive. | Add clearer "reference only" framing. |
| bmi-calculator | Keep | Useful calculator. | Add unit options and health disclaimer. |
| calorie-calculator | Improve | Useful but health-adjacent and simplified. | Add disclaimer, units, formula explanation. |
| financial-goal-calculator | Improve | Useful but finance-adjacent and simplified. | Add assumptions, disclaimer, scenario controls. |
| sleep-calculator | Keep | Useful lightweight planner. | Add bedtime/wake modes and copy slots. |
| retirement-calculator | Improve | Finance-adjacent and simplified. | Add assumptions, inflation, disclaimer. |

## Test Baseline

The first test slice covers shared pure transforms for:

- JSON format/minify
- Base64 Unicode encode/decode
- URL encode/decode and URL parsing
- CSV to JSON with quoted fields
- SQL formatting behavior
- Regex matching, capture groups, and replacement preview

Run it with:

```bash
npm run test --workspace apps/web
```
