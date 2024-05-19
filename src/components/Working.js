import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import girlImage from '../assets/girl.png';
import { Button } from 'antd';
import './components.scss';

const messages = [
  "Scanned all files",
  "Backed up the folder",
  "Generated the organization instructions",
  "Processing files",
  "Organization done!"
];

const Working = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => {
        if (prevIndex < messages.length - 1) {
          return prevIndex + 1;
        } else {
          clearInterval(interval);
          setShowNextButton(true);
          return prevIndex;
        }
      });
    }, 2000); // Change the interval time as needed

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (error) {
      navigate('/error');
    } else {
      navigate('/finished');
    }
  };

  return (
    <div className="working-container">
      <img src={girlImage} alt="Girl" className="girl-image" />
      <h2>Hang on, I'm working on it...</h2>
      <div className="messages-container">
        {messages.slice(0, currentMessageIndex + 1).map((message, index) => (
          <div key={index} className="message">
            <CheckCircleOutlined className="icon" />
            {message}
          </div>
        ))}
      </div>
      {showNextButton && (
        <Button type="primary" onClick={handleNext} className="next-button">
          {error ? 'Redirect to Error' : 'Show Next'}
        </Button>
      )}
    </div>
  );
};

export default Working;
