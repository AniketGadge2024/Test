import React, { useState, useEffect } from 'react';
import './Buss.css';
import Admin from './Admin';

const Bussiness = () => {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9enyNi32L7ZBVDD1_N4etuUllKjENJGCygDNaUnC-rf8w-04BfkE9tiYbSkYsq6pQPg/exec";

  const [sheetTotals, setSheetTotals] = useState({ totalInvestment: 0, totalMoney: 0 });
  const [investments, setInvestments] = useState([{ category: '', amount: '' }]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cash: '',
    online: '',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSheetData = async () => {
    try {
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();
      
      if (data && data.length > 0) {
        let maxInvestment = 0;
        let maxMoney = 0;

        data.forEach(row => {
          const values = Object.values(row);
          const rowInv = Number(values[8]) || 0;
          const rowMon = Number(values[9]) || 0;

          if (rowInv > maxInvestment) maxInvestment = rowInv;
          if (rowMon > maxMoney) maxMoney = rowMon;
        });

        if (maxInvestment === 0 && maxMoney === 0) {
          data.forEach(row => {
            const values = Object.values(row);
            maxInvestment += Number(values[3]) || 0; 
            maxMoney += Number(values[6]) || 0;      
          });
        }
        
        setSheetTotals({
          totalInvestment: maxInvestment,
          totalMoney: maxMoney
        });
      }
    } catch (error) {
      console.error("Error fetching columns I and J:", error);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  const liveFormInvestment = investments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const liveFormMoney = (Number(formData.cash) || 0) + (Number(formData.online) || 0);

  // Dynamic Calculation: Total Money minus Total Investment
  const netProfitLoss = sheetTotals.totalMoney - sheetTotals.totalInvestment;
  const isProfit = netProfitLoss >= 0;

  const handleInvestmentChange = (index, field, value) => {
    const updated = [...investments];
    updated[index][field] = value;
    setInvestments(updated);
  };

  const addInvestmentRow = () => {
    setInvestments([...investments, { category: '', amount: '' }]);
  };

  const removeInvestmentRow = (index) => {
    if (investments.length > 1) {
      setInvestments(investments.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (actionType) => {
    if (!formData.date) {
      setMessage("⚠️ Date is required.");
      return;
    }

    setLoading(true);
    setMessage('');

    const categoriesString = investments.map(i => i.category.trim() || 'N/A').join(', ');
    const amountsString = investments.map(i => i.amount || '0').join(', ');

    const urlParams = new URLSearchParams();
    urlParams.append('action', actionType);
    urlParams.append('date', formData.date);
    urlParams.append('investCat', categoriesString);
    urlParams.append('investment', amountsString);
    urlParams.append('totalBusiness', liveFormInvestment.toString()); 
    urlParams.append('cash', formData.cash || '0');
    urlParams.append('online', formData.online || '0');
    urlParams.append('total', liveFormMoney.toString()); 
    urlParams.append('note', formData.note);

    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams.toString(),
      });

      if (actionType === 'add') {
        setMessage("🎉 New entry successfully added!");
        setInvestments([{ category: '', amount: '' }]);
        setFormData(prev => ({ ...prev, cash: '', online: '', note: '' }));
      } else {
        setMessage(`🎉 Data appended and updated successfully for date: ${formData.date}!`);
      }

      setTimeout(() => fetchSheetData(), 1500);
    } catch (error) {
      console.error(error);
      setMessage("❌ Transmission failed. Check your console logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracker-wrapper">
      
      {/* Metrics Dashboard Row */}
      <div className="dashboard-cards">
        <div className="card investment">
          <span className="card-label">Total Investment</span>
          <strong className="card-value">${sheetTotals.totalInvestment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
        
        <div className="card revenue">
          <span className="card-label">Total Money</span>
          <strong className="card-value">${sheetTotals.totalMoney.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>

        {/* New Net Profit / Loss Tracking Card */}
        <div className={`card net-performance ${isProfit ? 'profit' : 'loss'}`}>
          <span className="card-label">{isProfit ? 'Net Profit' : 'Net Loss'}</span>
          <strong className="card-value">
            {isProfit ? '' : '-'}${Math.abs(netProfitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </strong>
        </div>
      </div>

      {/* Main Control Panel */}
      <div className="main-panel">
        <div className="panel-header">
          <h2>Syndicate</h2>
          <p>Add Details</p>
        </div>
        
        {message && (
          <div className={`status-banner ${message.includes('🎉') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="tracker-form">
          <div className="form-group">
            <label className="field-label">Target Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="field-label">Investment Breakdown</label>
            <div className="dynamic-rows">
              {investments.map((item, index) => (
                <div key={index} className="dynamic-row-item">
                  <input 
                    type="text" 
                    placeholder="Category (e.g. Stocks)" 
                    value={item.category} 
                    onChange={(e) => handleInvestmentChange(index, 'category', e.target.value)}
                    className="form-input flex-grow-2" 
                  />
                  <input 
                    type="number" 
                    placeholder="Amount" 
                    value={item.amount} 
                    onChange={(e) => handleInvestmentChange(index, 'amount', e.target.value)}
                    className="form-input flex-grow-1" 
                  />
                  {investments.length > 1 && (
                    <button type="button" onClick={() => removeInvestmentRow(index)} className="btn-remove" title="Remove row">
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addInvestmentRow} className="btn-secondary">
              + Add Category
            </button>
          </div>

          <div className="grid-split">
            <div className="form-group">
              <label className="field-label">Cash Payment</label>
              <input type="number" name="cash" value={formData.cash} onChange={handleChange} placeholder="0.00" className="form-input" />
            </div>
            <div className="form-group">
              <label className="field-label">Online Payment</label>
              <input type="number" name="online" value={formData.online} onChange={handleChange} placeholder="0.00" className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="field-label">Notes / Context</label>
            <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Describe transaction specific executions..." className="form-input form-textarea" />
          </div>

          <div className="action-row">
            <button type="button" disabled={loading} onClick={() => handleSubmit('add')} className="btn-primary btn-add">
              {loading ? 'Sending...' : 'Add New Entry'}
            </button>
            <button type="button" disabled={loading} onClick={() => handleSubmit('update')} className="btn-primary btn-update">
              {loading ? 'Syncing...' : 'Update Existing Date'}
            </button>
          </div>
        </form>
      </div>
      <Admin></Admin>
    </div>
  );
};

export default Bussiness;