import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [pin, setPin] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const correctPin = "100526"; // Set your desired PIN here

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newPin = [...pin];
    newPin[index] = element.value;
    setPin(newPin);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (pin.join("") === correctPin) {
      navigate('/buss'); // Redirects to Message.jsx
    }
  }, [pin, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Enter Security PIN</h2>
        <div style={styles.pinContainer}>
          {pin.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={styles.input}
            />
          ))}
        </div>
        <p style={styles.hint}>Automatic redirect upon correct entry</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'sans-serif'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.18)'
  },
  title: { color: '#fff', marginBottom: '20px', fontWeight: '300' },
  pinContainer: { display: 'flex', gap: '10px' },
  input: {
    width: '45px',
    height: '55px',
    fontSize: '24px',
    textAlign: 'center',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'white',
    color: '#333',
    outline: 'none',
    transition: 'transform 0.2s',
  },
  hint: { color: '#ddd', marginTop: '20px', fontSize: '14px' }
};

export default Login;