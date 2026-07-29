import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onQuetThanhCong: (ketQua: string) => void;
}

/**
 * Component quet QR code su dung camera sau
 * Toi uu cho Android cau hinh thap
 */
export default function QRScanner({ onQuetThanhCong }: QRScannerProps) {
  const [loi, setLoi] = useState("");
  const [dangQuet, setDangQuet] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-scanner-container";

  const batDauQuet = useCallback(async () => {
    setDangQuet(true);
    setLoi("");
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          onQuetThanhCong(decodedText);
          dungQuet();
        },
        () => {
          // Bo qua loi decode tung frame
        },
      );
    } catch (err) {
      setLoi("Không thể mở camera. Vui lòng cấp quyền truy cập camera.");
      setDangQuet(false);
      console.error(err);
    }
  }, [onQuetThanhCong]);

  function dungQuet() {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setDangQuet(false);
  }

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div>
      <div
        id={containerId}
        style={{
          width: "100%",
          minHeight: 250,
          background: "#f5f5f5",
          borderRadius: 8,
        }}
      />
      {loi && <p style={{ color: "red", fontSize: 13, marginTop: 8 }}>{loi}</p>}
      {!dangQuet ? (
        <button
          className="btn-chinh"
          onClick={batDauQuet}
          style={{ width: "100%", marginTop: 12 }}
        >
          Bắt đầu quét
        </button>
      ) : (
        <button
          className="btn-phu"
          onClick={dungQuet}
          style={{ width: "100%", marginTop: 12 }}
        >
          Dừng quét
        </button>
      )}
    </div>
  );
}
