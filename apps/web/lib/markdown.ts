export type BlogFrontmatter = {
  title: string;
  description: string;
  slug: string;
  date: string;
};

export type ParsedMarkdownDocument<TFrontmatter extends Record<string, string>> = {
  frontmatter: TFrontmatter;
  content: string;
};

export function parseFrontmatter<TFrontmatter extends Record<string, string>>(source: string): ParsedMarkdownDocument<TFrontmatter> {
  const trimmed = source.trim();

  if (!trimmed.startsWith("---")) {
    throw new Error("Markdown document is missing frontmatter.");
  }

  const match = trimmed.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid frontmatter format.");
  }

  const [, rawFrontmatter, content] = match;
  const entries = rawFrontmatter
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) {
        throw new Error(`Invalid frontmatter line: ${line}`);
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");
      return [key, value] as const;
    });

  return {
    frontmatter: Object.fromEntries(entries) as TFrontmatter,
    content: content.trim(),
  };
}

export function markdownToHtml(markdown: string) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("### ")) return `<h3>${escapeHtml(block.slice(4))}</h3>`;
      if (block.startsWith("## ")) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) return `<h1>${escapeHtml(block.slice(2))}</h1>`;

      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .map((line) => line.replace(/^-\s+/, "").trim())
          .filter(Boolean)
          .map((line) => `<li>${formatInlineMarkdown(escapeHtml(line))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }

      if (/^\d+\.\s/.test(block)) {
        const items = block
          .split("\n")
          .map((line) => line.replace(/^\d+\.\s+/, "").trim())
          .filter(Boolean)
          .map((line) => `<li>${formatInlineMarkdown(escapeHtml(line))}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }

      return `<p>${formatInlineMarkdown(escapeHtml(block).replace(/\n/g, "<br />"))}</p>`;
    })
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
