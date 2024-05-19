import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import girlImage from '../assets/girl.png';
import './Finished.css';

const Finished = () => {
  const navigate = useNavigate();

  const handleFeedback = () => {
    navigate('/feedback');
  };

  return (
    <div className="finished-container">
      <img src={girlImage} alt="Girl" className="girl-image" />
      <h2>Yay! I'm done</h2>
      <p>Lorem ipsum dolor sit amet consectetur. Nibh augue facilisis nunc integer nulla. Massa eleifend pharetra amet eleifend quis nibh vitae pharetra purus. Pulvinar elementum porttitor dictum egestas sit lorem ut morbi eu. Mi lorem netus diam odio enim ipsum sem mattis mattis.</p>
      <Button type="primary" onClick={handleFeedback} className="feedback-button">
        Give feedback
      </Button>
    </div>
  );
};

export default Finished;
