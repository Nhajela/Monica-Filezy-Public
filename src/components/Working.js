import React, { useState, useEffect } from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import girlImage from '../assets/girl.png';
import { Button, Spin, notification } from 'antd';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { folderPath, backup } = location.state || {};

  useEffect(() => {
    const runTasks = async () => {
      try {
        // Step 1: Scan folder
        const depth = 2; // Or fetch from settings
        const scannedTree = await window.electron.scanFolder(folderPath, depth);
        console.log('Scanned file tree:', scannedTree);
        setCurrentMessageIndex(0);

        // Step 2: Backup folder if needed
        if (backup) {
          // Add your backup logic here
          setCurrentMessageIndex(1);
        }

        // Step 3: Get GPT Instructions
        let instructions;
        try {
          instructions = await window.electron.getGPTInstructions(JSON.stringify(scannedTree, null, 2));
          if (instructions) {
            notification.success({
              message: 'Success',
              description: 'Instructions received successfully.',
            });
            console.log(instructions);
            setCurrentMessageIndex(2);
          } else {
            notification.error({
              message: 'Error',
              description: 'Failed to get instructions.',
            });
            setError(true);
            setLoading(false);
            setShowNextButton(true);
            return;
          }
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'An error occurred while getting instructions.',
          });
          console.error('Error:', error);
          setError(true);
          setLoading(false);
          setShowNextButton(true);
          return;
        }

        // Step 4: Execute Instructions
        try {
          const fileInstructions = instructions['instruction_list'];
          await window.electron.executeInstructions({
            instructions: fileInstructions,
            basePath: folderPath
          });
          notification.success({
            message: 'Success',
            description: 'Instructions executed successfully.',
          });
          setCurrentMessageIndex(3);
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'An error occurred while executing instructions.',
          });
          console.error('Error:', error);
          setError(true);
          setLoading(false);
          setShowNextButton(true);
          return;
        }

        // Step 5: Finish
        setCurrentMessageIndex(4);
        setLoading(false);
        setShowNextButton(true);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
        setShowNextButton(true);
      }
    };

    runTasks();
  }, [folderPath, backup]);

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
      {loading && <Spin size="large" />}
      {showNextButton && (
        <Button type="primary" onClick={handleNext} className="next-button">
          {error ? 'Redirect to Error' : 'Show Next'}
        </Button>
      )}
    </div>
  );
};

export default Working;
