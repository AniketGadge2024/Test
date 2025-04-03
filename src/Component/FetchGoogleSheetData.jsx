import { useState, useEffect } from "react";

const useFetchGoogleSheetData = (scriptURL) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(scriptURL);
        const result = await response.json();

        if (result.length > 0) {
  
          const formattedData = result.map((item) => ({
            Category: item.Category,
            Amount: parseFloat(item.Amount) || 0, 
          }));

          setData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scriptURL]);

  return { data, loading };
};

export default useFetchGoogleSheetData;
