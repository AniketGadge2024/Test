import React, { useState } from "react";


const AddItem = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showScanner, setShowScanner] = useState(false); // Toggle scanner visibility

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !amount) {
      setMessage("Both fields are required!");
      return;
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxe8Sh8ixrETJZ452l06rVKRzJKAFDMxgx9j3WaGkw6EZpCl5o3JGj1uVAvg1MSZsar9A/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ Category: category, Amount: amount }),
        }
      );

      const result = await response.text();

      if (result === "Success") {
        setMessage("✅ Data added successfully!");
        setCategory("");
        setAmount("");
      } else {
        setMessage("❌ Failed to add data.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ An error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-lg font-semibold">Add Data to Google Sheet</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter Category (or Scan QR)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-md shadow-sm w-64"
          />
          <button
            type="button"
            onClick={() => setShowScanner(!showScanner)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 p-1 rounded-md text-sm"
          >
            {showScanner ? "Close Scanner" : "Scan QR"}
          </button>
        </div>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded-md shadow-sm w-64"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      
      {showScanner && (
        <div className="mt-4 border p-2 rounded-md shadow-md">
          <QrReader
            onResult={(result, error) => {
              if (result) {
                setCategory(result.text); // Auto-fill category with QR code data
                setShowScanner(false); // Close scanner after scanning
              }
              if (error) {
                console.error(error);
              }
            }}
            constraints={{ facingMode: "environment" }} // Use back camera
            className="w-64 h-64"
          />
        </div>
      )}

      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
};

export default AddItem;
