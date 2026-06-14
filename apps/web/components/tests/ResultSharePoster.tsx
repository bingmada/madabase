"use client";

import { Download, Image as ImageIcon, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

type PosterResult = {
  title: string;
  summary: string;
  traits: string[];
};

function paletteForType(type: string) {
  const palettes = [
    ["#0f766e", "#f59e0b", "#111827"],
    ["#7c3aed", "#06b6d4", "#18181b"],
    ["#be123c", "#f97316", "#1f2937"],
    ["#2563eb", "#84cc16", "#172554"],
  ];
  const seed = Array.from(type).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palettes[seed % palettes.length];
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const chars = Array.from(text);
  let line = "";
  let lines = 0;
  for (const char of chars) {
    const next = `${line}${char}`;
    if (context.measureText(next).width > maxWidth && line) {
      context.fillText(line, x, y);
      y += lineHeight;
      lines += 1;
      line = char;
      if (lines >= maxLines - 1) break;
    } else {
      line = next;
    }
  }
  if (line && lines < maxLines) context.fillText(line, x, y);
}

export function ResultSharePoster({
  locale,
  testTitle,
  resultType,
  result,
  testUrl,
}: {
  locale: Locale;
  testTitle: string;
  resultType: string;
  result: PosterResult;
  testUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [primary, accent, ink] = paletteForType(resultType);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = 900;
      const height = 1200;
      canvas.width = width;
      canvas.height = height;
      setReady(false);

      ctx.fillStyle = "#f6f7f4";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, width, 18);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(48, 58, width - 96, height - 116);
      ctx.strokeStyle = "#d8ddd5";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 58, width - 96, height - 116);

      ctx.fillStyle = primary;
      ctx.font = "700 28px Arial, sans-serif";
      ctx.fillText(testTitle.toUpperCase(), 86, 130);

      ctx.fillStyle = ink;
      ctx.font = "900 132px Arial, sans-serif";
      ctx.fillText(resultType, 82, 278);
      ctx.fillStyle = accent;
      ctx.font = "900 54px Arial, sans-serif";
      wrapText(ctx, result.title, 88, 350, 720, 62, 2);

      ctx.fillStyle = "#475569";
      ctx.font = "32px Arial, sans-serif";
      wrapText(ctx, result.summary, 88, 460, 720, 46, 5);

      result.traits.slice(0, 3).forEach((trait, index) => {
        const x = 88 + index * 230;
        ctx.fillStyle = index === 0 ? primary : index === 1 ? accent : "#111827";
        ctx.fillRect(x, 650, 196, 64);
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 24px Arial, sans-serif";
        wrapText(ctx, trait, x + 18, 690, 160, 28, 1);
      });

      ctx.fillStyle = "#111827";
      ctx.font = "900 34px Arial, sans-serif";
      ctx.fillText(locale === "en" ? "Scan to take the test" : "扫码开始测试", 88, 820);
      ctx.fillStyle = "#64748b";
      ctx.font = "26px Arial, sans-serif";
      ctx.fillText("madabase.com", 88, 862);

      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, testUrl, {
        errorCorrectionLevel: "M",
        margin: 2,
        width: 240,
        color: { dark: "#111827", light: "#ffffff" },
      });
      if (cancelled) return;
      const qrX = width - 272 - 70;
      const qrY = height - 272 - 70;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(qrX, qrY, 272, 272);
      ctx.strokeStyle = "#d8ddd5";
      ctx.strokeRect(qrX, qrY, 272, 272);
      ctx.drawImage(qrCanvas, qrX + 16, qrY + 16, 240, 240);

      ctx.fillStyle = primary;
      ctx.font = "900 46px Arial, sans-serif";
      ctx.fillText("Madabase", 86, height - 112);
      setReady(true);
    }

    void draw();
    return () => {
      cancelled = true;
    };
  }, [accent, ink, locale, primary, result.summary, result.title, result.traits, resultType, testTitle, testUrl]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `madabase-${resultType.toLowerCase()}-result.png`;
    link.click();
  }

  async function share() {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.share) {
      download();
      return;
    }
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `madabase-${resultType.toLowerCase()}-result.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${testTitle}: ${resultType}` });
      } else {
        download();
      }
    });
  }

  return (
    <section className="mt-5 rounded-md border border-[var(--border)] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--brand-soft)] text-[var(--brand-strong)]">
            <ImageIcon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-[var(--text)]">{locale === "en" ? "Share result poster" : "结果分享海报"}</h3>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{locale === "en" ? "Includes a scannable QR code for this test." : "包含可扫码打开测试题的二维码。"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={download} disabled={!ready} className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] disabled:opacity-50">
            <Download className="h-4 w-4" />
            {locale === "en" ? "Download" : "下载"}
          </button>
          <button type="button" onClick={share} disabled={!ready} className="inline-flex h-10 items-center gap-2 rounded-md bg-[var(--surface-code)] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)] disabled:opacity-50">
            <Share2 className="h-4 w-4" />
            {locale === "en" ? "Share" : "分享"}
          </button>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <canvas ref={canvasRef} className="aspect-[3/4] w-full max-w-[360px] rounded-md border border-[var(--border)] bg-[var(--surface-muted)] sm:max-w-[420px] lg:max-w-[360px]" />
      </div>
    </section>
  );
}
