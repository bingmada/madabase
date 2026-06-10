"use client";

import type { ToolComponentName } from "@/lib/tools";
import { Base64Tool } from "./Base64Tool";
import {
  CaseConverter,
  CharacterCounter,
  ColorConverter,
  CronGenerator,
  CssFormatter,
  HashGenerator,
  HtmlEncoder,
  JsFormatter,
  JsonDiff,
  JsonEscape,
  PasswordGenerator,
  QrCodeGenerator,
  RegexTester,
  SlugGenerator,
  SqlFormatter,
  TextCleaner,
  UrlParser,
  WordCounter,
  XmlFormatter,
  YamlFormatter,
} from "./ExtraTools";
import { HtmlFormatter } from "./HtmlFormatter";
import { JsonFormatter } from "./JsonFormatter";
import { JsonToTypescript } from "./JsonToTypescript";
import { JsonValidator } from "./JsonValidator";
import { JwtDecoder } from "./JwtDecoder";
import { MarkdownPreview } from "./MarkdownPreview";
import { TimestampConverter } from "./TimestampConverter";
import { UrlEncoder } from "./UrlEncoder";
import { UuidGenerator } from "./UuidGenerator";

const toolComponents: Record<ToolComponentName, React.ComponentType<{ toolSlug?: string }>> = {
  JsonFormatter,
  JsonValidator,
  JsonToTypescript,
  JwtDecoder,
  UuidGenerator,
  Base64Tool,
  UrlEncoder,
  TimestampConverter,
  MarkdownPreview,
  HtmlFormatter,
  JsonDiff,
  JsonEscape,
  YamlFormatter,
  XmlFormatter,
  SqlFormatter,
  RegexTester,
  CronGenerator,
  HashGenerator,
  ColorConverter,
  PasswordGenerator,
  WordCounter,
  CharacterCounter,
  CaseConverter,
  TextCleaner,
  SlugGenerator,
  QrCodeGenerator,
  HtmlEncoder,
  CssFormatter,
  JsFormatter,
  UrlParser,
};

export function ToolRenderer({ component, toolSlug }: { component: ToolComponentName; toolSlug?: string }) {
  const Component = toolComponents[component];
  return <Component toolSlug={toolSlug} />;
}
