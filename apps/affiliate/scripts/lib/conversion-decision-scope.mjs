// Scope copy checks to the marked decision element. Byte counts depend on
// markup, escaping and title length; they do not represent a viewport.
export function markedCommerceDecision(html, attribute) {
  const identityMarker = ["data-guide-task-alternative", "data-merchant21-route"].includes(attribute);
  if (!identityMarker && !["data-first-viewport-commerce", "data-guide-decision-purchase", "data-guide-task-paths", "data-guide-retailer-option", "data-guide-family-purchase-reference", "data-tool-retailer-reference", "data-roundup-task-choice", "data-decision-first-comparison"].includes(attribute)) throw new Error("Unknown decision marker");
  const marker = new RegExp(`\\b${attribute}\\s*=\\s*(["'])${identityMarker ? "[a-z0-9-]+" : "true"}\\1`, "i");
  const tokens = /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>|<\/?([a-z][\w:-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
  const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  let start = -1, name = "", depth = 0;
  for (const match of html.matchAll(tokens)) {
    if (!match[1]) continue;
    const tag = match[1].toLowerCase();
    const closing = match[0].startsWith("</");
    if (start < 0) {
      if (closing || !marker.test(match[0])) continue;
      start = match.index; name = tag; depth = 1;
    } else if (tag === name) {
      if (closing) depth--;
      else if (!voidTags.has(tag) && !/\/\s*>$/.test(match[0])) depth++;
    }
    if (depth === 0) {
      const end = match.index + match[0].length;
      return {start, end, html: html.slice(start, end)};
    }
  }
  return undefined;
}

export function firstCommerceDecision(html) {
  return markedCommerceDecision(html, "data-first-viewport-commerce");
}
