import type { Locale } from "@/lib/i18n";

export function AdSlot(props: {
  locale: Locale;
  position: "header" | "content" | "footer" | "sidebar" | "inline";
  size?: "banner" | "square" | "native";
}) {
  void props;
  return null;
}
