import {
  Binary,
  Braces,
  Clock3,
  Code2,
  FileCode2,
  Fingerprint,
  KeyRound,
  Link2,
  ScanText,
  Type,
} from "lucide-react";
import type { ToolComponentName } from "@/lib/tools";

const iconMap = {
  JsonFormatter: Braces,
  JsonValidator: ScanText,
  JsonToTypescript: Type,
  JwtDecoder: KeyRound,
  UuidGenerator: Fingerprint,
  Base64Tool: Binary,
  UrlEncoder: Link2,
  TimestampConverter: Clock3,
  MarkdownPreview: FileCode2,
  HtmlFormatter: Code2,
} satisfies Record<ToolComponentName, React.ComponentType<{ className?: string }>>;

export function ToolIcon({ component, className = "h-5 w-5" }: { component: ToolComponentName; className?: string }) {
  const Icon = iconMap[component];
  return <Icon className={className} aria-hidden="true" />;
}
