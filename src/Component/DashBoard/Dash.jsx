import React from "react";
import useFetchGoogleSheetData from "../FetchGoogleSheetData";

const Dash = () => {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbxe8Sh8ixrETJZ452l06rVKRzJKAFDMxgx9j3WaGkw6EZpCl5o3JGj1uVAvg1MSZsar9A/exec";

  const { data, loading } = useFetchGoogleSheetData(scriptURL); 

  return (
    <div>
     

     
      {loading ? (
        <div className="loading-container">
          <p>Loading data...</p>
        </div>
      ) : data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className="data-item">
            <p><strong>Category:</strong> {item.Category}</p>
            <p><strong>Amount:</strong> {item.Amount}</p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Dash;
