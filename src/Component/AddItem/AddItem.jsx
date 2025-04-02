import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState, useRef } from "react";

const AddItem = () => {
  const [scannedData, setScannedData] = useState(""); // Stores QR Code data (Category)
  const [amount, setAmount] = useState(""); // Stores manual Amount input
  const scannerRef = useRef(null); // Reference for QR scanner instance

  const googleScriptURL =
    "https://script.google.com/macros/s/AKfycbxe8Sh8ixrETJZ452l06rVKRzJKAFDMxgx9j3WaGkw6EZpCl5o3JGj1uVAvg1MSZsar9A/exec"; // Replace with your actual script URL

  useEffect(() => {
    if (scannedData) return; // If scannedData is already set, stop further scanning.

    const onSuccess = (text) => {
      setScannedData(text); 

      if (scannerRef.current) {
        scannerRef.current.clear(); // Stop the scanner after a successful scan
      }
    };

    const onError = (error) => {
      console.log(error);
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      true
    );

    html5QrcodeScanner.render(onSuccess, onError);
    scannerRef.current = html5QrcodeScanner; // Store scanner instance

    return () => {
      html5QrcodeScanner.clear(); // Cleanup scanner when unmounting
    };
  }, [scannedData]); // Re-run only when scannedData changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scannedData || !amount) {
      alert("Please scan a QR code and enter an amount.");
      return;
    }

    const formData = new FormData();
    formData.append("Category", scannedData);
    formData.append("Amount", amount);

    try {
      const response = await fetch(googleScriptURL, {
        method: "POST",
        body: new URLSearchParams(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setScannedData(""); // Reset scanned data
        setAmount(""); // Reset amount input
      } else {
        alert("Error submitting data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Scan QR Code & Enter Amount</h2>
      {!scannedData && <div id="reader" style={{ width: "300px", height: "300px" }}></div>}

      <form onSubmit={handleSubmit}>
        
        <input
          type="text"
          value={scannedData}
          placeholder="Scanned QR Code Data (Category)"
          readOnly
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            fontSize: "16px",
          }}
        />
        <input
          type="number"
          id="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          required
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            fontSize: "16px",
          }}
        />
       
        <button type="submit" style={{ marginTop: "10px", padding: "10px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItem;
