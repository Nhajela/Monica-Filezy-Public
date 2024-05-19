import React, { useState } from 'react';
import { Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import girlImage from '../assets/girl.png';
import './components.scss';

const { TextArea } = Input;

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleSendFeedback = () => {
    if (!feedback) {
      notification.error({
        message: 'Error',
        description: 'Feedback cannot be empty.',
      });
      return;
    }

    console.log('Feedback sent:', feedback);

    notification.success({
      message: 'Success',
      description: 'Thank you for your feedback!',
    });

    navigate('/');
  };

  return (
    <div className="feedback-container">
      <img src={girlImage} alt="Girl" className="girl-image" />
      <h2>How did you find the results?</h2>
      <TextArea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Your text"
        rows={4}
        style={{ marginTop: '10px', marginBottom: '20px' }}
      />
      <Button type="primary" onClick={handleSendFeedback} className="send-feedback-button">
        Send to devs & organise more!
      </Button>
    </div>
  );
};

export default Feedback;
