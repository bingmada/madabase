"use client";

import type { ToolComponentName } from "@/lib/tool-registry";
import type { Locale } from "@/lib/i18n";
import { ZodiacCompatibilityWidget } from "@/components/culture/ZodiacCompatibilityWidget";
import { BmiCalculator, CalorieCalculator, FinancialGoalCalculator, FiveElementsReference, RetirementCalculator, SleepCalculator } from "./CalculatorTools";
import { Base64Tool } from "./Base64Tool";
import {
  CaseConverter,
  CharacterCounter,
  ColorConverter,
  CronGenerator,
  CssFormatter,
  GenericTextTool,
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
  UserAgentParser,
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

const toolComponents: Record<ToolComponentName, React.ComponentType<{ toolSlug?: string; locale?: Locale }>> = {
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
  UserAgentParser,
  GenericTextTool,
};

export function ToolRenderer({ component, toolSlug, locale }: { component: ToolComponentName; toolSlug?: string; locale?: Locale }) {
  if (toolSlug === "zodiac-compatibility") {
    return <ZodiacCompatibilityWidget locale={locale ?? "en"} />;
  }
  if (toolSlug === "bmi-calculator") return <BmiCalculator locale={locale ?? "en"} />;
  if (toolSlug === "calorie-calculator") return <CalorieCalculator locale={locale ?? "en"} />;
  if (toolSlug === "sleep-calculator") return <SleepCalculator locale={locale ?? "en"} />;
  if (toolSlug === "financial-goal-calculator") return <FinancialGoalCalculator locale={locale ?? "en"} />;
  if (toolSlug === "retirement-calculator") return <RetirementCalculator locale={locale ?? "en"} />;
  if (toolSlug === "birthday-five-elements") return <FiveElementsReference locale={locale ?? "en"} />;

  const Component = toolComponents[component];
  return <Component toolSlug={toolSlug} locale={locale} />;
}
