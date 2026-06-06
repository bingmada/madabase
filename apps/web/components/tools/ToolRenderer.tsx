"use client";

import type { ToolComponentName } from "@/lib/tools";
import { Base64Tool } from "./Base64Tool";
import { HtmlFormatter } from "./HtmlFormatter";
import { JsonFormatter } from "./JsonFormatter";
import { JsonToTypescript } from "./JsonToTypescript";
import { JsonValidator } from "./JsonValidator";
import { JwtDecoder } from "./JwtDecoder";
import { MarkdownPreview } from "./MarkdownPreview";
import { TimestampConverter } from "./TimestampConverter";
import { UrlEncoder } from "./UrlEncoder";
import { UuidGenerator } from "./UuidGenerator";

const toolComponents: Record<ToolComponentName, React.ComponentType> = {
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
};

export function ToolRenderer({ component }: { component: ToolComponentName }) {
  const Component = toolComponents[component];
  return <Component />;
}
