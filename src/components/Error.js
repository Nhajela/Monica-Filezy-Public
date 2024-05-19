import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import girlImage from '../assets/girl.png';
import './components.scss';

const Error = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="error-container">
      <img src={girlImage} alt="Girl" className="girl-image" />
      <h2>Ah, something went wrong!</h2>
      <p>We're sorry for the inconvenience. Please try again.</p>
      <Button type="primary" onClick={handleBackHome}>
        Back to Home
      </Button>
    </div>
  );
};

export default Error;
