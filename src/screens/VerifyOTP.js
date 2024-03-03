import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VerifyOTP() {
  const [otp, setOTP] = useState('');
  const navigate = useNavigate();

  const handleVerifyClick = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:5000/api/verifyotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const json = await response.json();
      if (json.success) {
        // OTP verification successful
        navigate('/');
      } else {
        // Invalid OTP
        alert("invalid otp");
        console.error('Invalid OTP:', json.message);
      }
    } catch (error) {
      console.error('An error occurred while verifying OTP:', error);
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <div className="mb-3">
        <label htmlFor="otpInput" className="form-label">
          Enter OTP:
        </label>
        <input
          type="text"
          className="form-control"
          id="otpInput"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <button type="button" className="btn btn-primary" onClick={handleVerifyClick}>
          Verify
        </button>
      </div>
    </div>
  );
}
