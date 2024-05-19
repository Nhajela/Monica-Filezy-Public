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
  const { folderPath, customInstruction, backup } = location.state || {};

  useEffect(() => {
    const runTasks = async () => {
      try {
        // Step 1: Scan folder
        const depth = 2; // Or fetch from settings
        const fileTree = await window.electron.scanFolder(folderPath, depth);
        setCurrentMessageIndex(0);
        
        // Step 2: Backup folder if needed
        if (backup) {
          // Add your backup logic here
          setCurrentMessageIndex(1);
        }

        // Step 3: Get GPT Instructions
        const systemPrompt = await window.electron.readMarkdownFile('gpt_system_prompt.md');
        const userPrompt = `Here is the file tree:\n${JSON.stringify(fileTree, null, 2)}\n${customInstruction}`;
        const chatMessages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];
        const instructions = await window.electron.getGPTInstructions(chatMessages);
        setCurrentMessageIndex(2);

        // Step 4: Execute Instructions
        await window.electron.executeInstructions({
          instructions: instructions.instruction_list,
          basePath: folderPath
        });
        setCurrentMessageIndex(3);

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
  }, [folderPath, customInstruction, backup]);

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
