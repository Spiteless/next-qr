"use client";

import ReactDOMServer from "react-dom/server";
import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { QRCode } from "react-qrcode-logo";
import { HuePicker } from "react-color";

function QR() {
  const [qrData, setQrData] = useState("https://trilliumsmith.com/");
  const [isReady, setIsReady] = useState(false);
  const [colorBg, setColorBg] = useState("#ffffff00");
  const [colorFg, setColorFg] = useState("#ffffffff");

  const qrRef = useRef(null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleColorChangeBg = (color: { hex: string }) => {
    console.log(color);
    setColorBg(color.hex);
  };
  const handleColorChangeFg = (color: { hex: string }) => {
    console.log(color);
    setColorFg(color.hex);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrData(e.target.value);
  };

  const QrCodeComponent = () => (
    <QRCode
      size={256}
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      value={qrData}
      bgColor={colorBg}
      fgColor={colorFg}
    />
  );

  const downloadAsPNG = async () => {
    if (qrRef.current) {
      const dataUrl = await toPng(qrRef.current);
      const filename = getFilename(qrData, ".png");
      saveAs(dataUrl, filename);
    }
  };

  const downloadAsSVG = () => {
    const svgString = ReactDOMServer.renderToString(<QrCodeComponent />);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const filename = getFilename(qrData, ".svg");
    saveAs(blob, filename);
  };

  return (
    <div className="font-mono grid place-content-center bg-slate-500 min-h-screen">
      <div>
        <div className="my-10">
          <h2 className="text-2xl font-bold underline">Background Color: {colorBg}</h2>
          <div style={{ paddingBottom: "10px" }}>
            <HuePicker color={colorBg} onChangeComplete={handleColorChangeBg} />
          </div>
          <h2 className="text-2xl font-bold underline">Foreground Color: {colorFg}</h2>
          <div style={{ paddingBottom: "10px" }}>
            <HuePicker color={colorFg} onChangeComplete={handleColorChangeFg} />
          </div>
        </div>

        <input
          style={{ marginBottom: "6px" }}
          value={qrData}
          onChange={handleInputChange}
          className="text-black bg-white border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded"
          onClick={downloadAsPNG}
        >
          Download QR Code as PNG
        </button>
        <button
          className="bg-green-600 hover:bg-green-800 text-white font-bold my-2 py-2 px-4 rounded"
          onClick={downloadAsSVG}
        >
          Download QR Code as SVG
        </button>
      </div>
      <div>
        <div
          ref={qrRef}
          className="max-w-md p-4"
          style={{ background: colorBg }}
        >
          { <QrCodeComponent />}
        </div>
      </div>
    </div>
  );
}

const getFilename = (name: string, ext: string): string => {
  const filename =
    "qr_" +
    name
      .replace(/(^\w+:|^)\/\//, "")
      .replace(/\//g, "_")
      .replace(/\./g, "_")
      .replace(/_$/, "") +
    ext;
  return filename;
};

export default QR;