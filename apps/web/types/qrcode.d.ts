declare module "qrcode" {
  export type QRCodeErrorCorrectionLevel = "L" | "M" | "Q" | "H";

  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: {
      errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
      margin?: number;
      width?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    },
  ): Promise<void>;

  export function toString(
    text: string,
    options?: {
      type?: "svg";
      errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
      margin?: number;
      width?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    },
  ): Promise<string>;

  const QRCode: {
    toCanvas: typeof toCanvas;
    toString: typeof toString;
  };

  export default QRCode;
}
