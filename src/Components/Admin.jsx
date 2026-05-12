import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9enyNi32L7ZBVDD1_N4etuUllKjENJGCygDNaUnC-rf8w-04BfkE9tiYbSkYsq6pQPg/exec";
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogData = async () => {
    setLoading(true);
    try {
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Reverse array so the most recent dates show up first
        setLogs([...data].reverse());
      }
    } catch (err) {
      console.error("Error pulling history stream:", err);
      setError("Failed to sync log historical ledger data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogData();
  }, []);

  // FIXED: Timezone-offset compensating date parser
  const formatDateString = (rawDate) => {
    if (!rawDate) return "N/A";

    try {
      // 1. Create a base date object from whatever the backend sent
      let parsed = new Date(rawDate);
      
      if (isNaN(parsed.getTime())) {
        return String(rawDate); // Return as text if completely unparseable
      }

      // 2. Check if the parsed date string looks like a UTC midnight fallback 
      // (This is exactly what causes a "12th" to turn into an "11th" in local time profiles)
      if (String(rawDate).includes('-') && !String(rawDate).includes('T')) {
        // Add the timezone offset in minutes back to the date to cancel out the rollback
        parsed.setMinutes(parsed.getMinutes() + parsed.getTimezoneOffset());
      } else if (parsed.getHours() === 0 && parsed.getMinutes() === 0) {
        // If it evaluates exactly to local midnight due to system string parsing,
        // add 12 hours to safely push it into the middle of the correct day so it can't roll back.
        parsed.setHours(12);
      }

      // 3. Render using local browser settings
      return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

    } catch (error) {
      console.error("Frontend date adjustment failure: ", error);
      return String(rawDate);
    }
  };

  return (
    <div className="tracker-wrapper">
      <div className="main-panel">
        
        <div className="panel-header admin-header">
          <div>
            <h2>Day-Wise Business Logs</h2>
            <p></p>
          </div>
          <button onClick={fetchLogData} disabled={loading} className="btn-secondary refresh-btn">
            {loading ? 'Refreshing...' : '🔄 Refresh Log'}
          </button>
        </div>

        {error && <div className="status-banner error">{error}</div>}

        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner"></div>
            <p>Loading spreadsheet records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-placeholder">
            <p>No logged transaction history lines discovered inside Sheet1.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="log-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Investment Breakdowns</th>
                  <th>Total Investment</th>
                  <th>Total</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row, index) => {
                  const values = Object.values(row);
                  
                  const dateVal = values[0];                       
                  const catVal = values[1] || 'N/A';              
                  const breakDownAmounts = values[2] || '0';       
                  const totalInvestCol = Number(values[3]) || 0;   
                  const totalMoneyCol = Number(values[6]) || 0;    
                  const notesVal = values[7] || '—';               

                  const cats = catVal.split(',');
                  const amts = breakDownAmounts.toString().split(',');

                  return (
                    <tr key={index}>
                      <td className="td-date">
                        <strong>{formatDateString(dateVal)}</strong>
                      </td>
                      <td className="td-breakdown">
                        <div className="breakdown-chips">
                          {cats.map((c, i) => (
                            <span key={i} className="chip">
                              {c.trim()}: <strong>${Number(amts[i]) ? Number(amts[i]).toFixed(2) : '0.00'}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="td-currency neg">
                        ${totalInvestCol.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="td-currency pos">
                        ${totalMoneyCol.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="td-notes">
                        <span className="notes-text">{notesVal}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;