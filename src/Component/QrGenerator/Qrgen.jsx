import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

const Qrgen = () => {
  const [categories, setCategories] = useState([]); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbxe8Sh8ixrETJZ452l06rVKRzJKAFDMxgx9j3WaGkw6EZpCl5o3JGj1uVAvg1MSZsar9A/exec"
        );
        const data = await response.json();

        if (data.length > 0) {
          setCategories(data.map((item) => item.Category)); 
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-lg font-semibold">QR Codes for Categories</h2>
      {categories.map((category, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <p className="text-md font-medium">{category}</p>
          <QRCodeSVG value={category} className="border p-2 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default Qrgen;
