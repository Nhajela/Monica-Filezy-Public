import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import girlImage from '../assets/girl.png';
import './components.scss';

const Finished = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="finished-container">
      <img src={girlImage} alt="Girl" className="girl-image" />
      <h2>Yay! I'm done</h2>
      <p>The files have been successfully organized.</p>
      <Button type="primary" onClick={handleBackHome}>
        Back to Home
      </Button>
    </div>
  );
};

export default Finished;
