import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
function Passwordreset() {
  const { token } = useParams(); // Assuming the token is passed as a URL parameter
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();


  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`/en/reset-password/${token}`, { password });
      setMessage('Password has been set successfully! You can now login.');
      navigate('/signin'); // Redirect to login page
    } catch (error) {
      setMessage('An error occurred.');
      console.error('Error:', error);
    }
  };

  const formStyle = {
    width: '300px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    textAlign: 'center'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#990011FF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <div>
      <Navbar />
      <div className="login">
      <div className="login-container">

        {/* <h3 style={{ marginTop: '6%' }}>Reset Password</h3> */}
        <div className="login-header">
          <div className="login-icon">👵👴</div>
          <h2>Saanjh</h2>
          <p>Reset Password</p>
        </div>
        <div >
          <div className="input-group">
            <label for="new password">New Password</label>
            <input
              type="password"
              id="new password"
              name="password"
              // placeholder='New password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>
          <div className="input-group">
            <label for="confirm password">Confirm Password</label>
            <input
              type="password"
              id="confirm password"
              name="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          </div>
          <button className="login-btn" onClick={handleReset}>
            Reset Password
          </button>
          {message && <p>{message}</p>}
        </div>

      </div>
    </div>
    </div>
  );
}

export default Passwordreset;
