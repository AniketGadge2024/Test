import { Html5QrcodeScanner } from "html5-qrcode";
import React, { useEffect, useState, useRef } from "react";
import useFetchGoogleSheetData from "../FetchGoogleSheetData"; 

const AddItem = () => {
  const [scannedData, setScannedData] = useState(""); 
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [manualCategory, setManualCategory] = useState(""); 
  const [amount, setAmount] = useState(""); 
  const scannerRef = useRef(null); 

  const googleScriptURL =
    "https://script.google.com/macros/s/AKfycbxe8Sh8ixrETJZ452l06rVKRzJKAFDMxgx9j3WaGkw6EZpCl5o3JGj1uVAvg1MSZsar9A/exec"; 

  
  const { data: categories, loading } = useFetchGoogleSheetData(googleScriptURL);

  useEffect(() => {
    if (scannedData || selectedCategory || manualCategory) return; 
    const onSuccess = (text) => {
      setScannedData(text);
      setSelectedCategory(""); 
      setManualCategory(""); 

      if (scannerRef.current) {
        scannerRef.current.clear(); 
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
    scannerRef.current = html5QrcodeScanner;

    return () => {
      html5QrcodeScanner.clear();
    };
  }, [scannedData, selectedCategory, manualCategory]); 

  const handleSelectCategory = (event) => {
    setSelectedCategory(event.target.value);
    setScannedData(""); 
    setManualCategory(""); 

    if (scannerRef.current) {
      scannerRef.current.clear(); 
    }
  };

  const handleManualCategoryChange = (event) => {
    setManualCategory(event.target.value);
    setScannedData(""); 
    setSelectedCategory(""); 
    if (scannerRef.current) {
      scannerRef.current.clear(); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryToSubmit = scannedData || selectedCategory || manualCategory; 
    if (!categoryToSubmit || !amount) {
      alert("Please enter/select a category and enter an amount.");
      return;
    }

    const formData = new FormData();
    formData.append("Category", categoryToSubmit);
    formData.append("Amount", amount);

    try {
      const response = await fetch(googleScriptURL, {
        method: "POST",
        body: new URLSearchParams(formData),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        setScannedData(""); 
        setSelectedCategory(""); 
        setManualCategory("");
        setAmount(""); 
      } else {
        alert("Error submitting data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Scan QR Code, Select, or Enter Category</h2>

     
      {!scannedData && !selectedCategory && !manualCategory && (
        <div id="reader" style={{ width: "300px", height: "300px" }}></div>
      )}

      <form onSubmit={handleSubmit}>

       
        <input
          type="text"
          value={scannedData}
          placeholder="Scanned QR Code Data (Category)"
          readOnly
     
        />

        
        <select
          value={selectedCategory}
          onChange={handleSelectCategory}
          disabled={!!manualCategory} 

        >
          <option value="">Select Category</option>
          {categories.map((item, index) => (
            <option key={index} value={item.Category}>
              {item.Category}
            </option>
          ))}
        </select>

      
        <input
          type="text"
          value={manualCategory}
          onChange={handleManualCategoryChange}
          placeholder="Or enter category manually"

        />

       
        <input
          type="number"
          id="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          required
       
        />

        <button type="submit" style={{ marginTop: "10px", padding: "10px" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddItem;
