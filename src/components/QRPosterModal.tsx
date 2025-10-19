import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Booth {
  booth_id: number;
  name: string;
  location?: string | null;
  staff_pin?: string;
  qr_code_value?: string;
}

interface QRPosterModalProps {
  booth: Booth;
  onClose: () => void;
}

export default function QRPosterModal({ booth, onClose }: QRPosterModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const url = `${window.location.origin}/stamps?booth=${booth.booth_id}`;
    QRCode.toCanvas(canvasRef.current, url, { width: 260 });
  }, [booth]);

  const printPoster = () => {
    const printWin = window.open("", "PRINT", "height=800,width=600");
    if (!printWin) return;
    
    printWin.document.write(`
      <html>
        <head>
          <title>QR Poster</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            .poster { border: 4px solid #f472b6; padding: 24px; }
            h1 { margin: 0 0 6px; font-size: 28px; }
            h2 { margin: 0 0 16px; font-size: 24px; }
            .content { display: flex; gap: 24px; align-items: center; margin-top: 16px; }
            .details { font-size: 18px; line-height: 1.8; }
            .code { font-family: monospace; }
            .warning { margin-top: 16px; font-size: 14px; color: #555; }
          </style>
        </head>
        <body>
          <div class="poster">
            <h1>🎪 성덕제 LOVE IS ALL</h1>
            <h2>${booth.name}</h2>
            <div>📍 ${booth.location || ""}</div>
            <div style="margin: 16px 0">아래 QR을 스캔하거나, 코드/PIN을 입력하세요.</div>
            <div class="content">
              <div><img id="qrimg"/></div>
              <div class="details">
                <div><b>부스 코드</b>: <span class="code">${booth.qr_code_value || "-"}</span></div>
                <div><b>PIN</b>: <span class="code">${booth.staff_pin || "-"}</span></div>
              </div>
            </div>
            <p class="warning">※ 본 포스터는 관리자 전용입니다. 외부 공유 금지.</p>
          </div>
        </body>
      </html>
    `);
    
    const qrDataUrl = (canvasRef.current as HTMLCanvasElement).toDataURL();
    const imgTag = printWin.document.getElementById("qrimg") as HTMLImageElement;
    imgTag.src = qrDataUrl;
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
      printWin.close();
    }, 250);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">QR 포스터 — {booth.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            인쇄하면 현장 부스에 부착할 수 있어요.
          </p>
          <div className="flex gap-4 items-center p-4 bg-muted/50 rounded-lg">
            <canvas ref={canvasRef} />
            <div className="text-sm space-y-1">
              <div>
                <span className="font-semibold">부스 코드:</span>
                <br />
                <span className="font-mono text-primary">{booth.qr_code_value || "-"}</span>
              </div>
              <div>
                <span className="font-semibold">PIN:</span>
                <br />
                <span className="font-mono text-primary">{booth.staff_pin || "-"}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={printPoster} className="bg-gradient-to-r from-primary to-secondary">
              인쇄/저장
            </Button>
            <Button onClick={onClose} variant="outline">
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
