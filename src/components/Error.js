import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import girlImage from '../assets/girl.png';
import './Error.css';

const Error = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  const handleSendToDevs = () => {
    // Simulate sending error details to the devs
    console.log('Error details sent to the devs.');
  };

  return (
    <div className="error-container">
      <img src={girlImage} alt="Girl" className="girl-image" />
      <h2>Ah, something went wrong!</h2>
      <p>error text</p>
      <div className="button-group">
        <Button type="primary" onClick={handleSendToDevs} className="send-button">
          Send to the devs
        </Button>
        <Button type="default" onClick={handleBackHome} className="back-button">
          Back to home
        </Button>
      </div>
    </div>
  );
};

export default Error;
