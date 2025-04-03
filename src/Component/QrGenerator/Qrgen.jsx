import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useFetchGoogleSheetData from "../FetchGoogleSheetData";

const Qrgen = () => {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbxe8Sh8ixrETJZ452l06rVKRzJKAFDMxgx9j3WaGkw6EZpCl5o3JGj1uVAvg1MSZsar9A/exec";

  const { data, loading } = useFetchGoogleSheetData(scriptURL);
  const qrRef = useRef(null);

  
  const categories = [...new Set(data.map((item) => item.Category))];

  
  const handleDownload = async () => {
    if (!qrRef.current) return;

    const canvas = await html2canvas(qrRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png", 0.8);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
    pdf.save("QR_Codes.pdf");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      

     
      {loading ? (
        <div className="w-40 h-40 flex items-center justify-center bg-gray-200 rounded-md animate-pulse">
          Loading...
        </div>
      ) : (
        <div ref={qrRef}>
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center gap-2 download-page">
              <p className="text-md font-medium">{category}</p>
              <QRCodeSVG value={category} className="border p-2 rounded-md" />
            </div>
          ))}
        </div>
      )}

    
      {categories.length > 0 && !loading && (
        <button onClick={handleDownload} className="btn btn-primary mt-4 p-2">
          Download QR Codes
        </button>
      )}
    </div>
  );
};

export default Qrgen;
