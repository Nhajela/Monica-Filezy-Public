import React, { useState } from 'react';
import { Input, Button, notification } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './components.scss';

const { TextArea } = Input;

const TestGPT = () => {
  const [folderPath, setFolderPath] = useState('');
  const [fileTree, setFileTree] = useState(null);
  const [response, setResponse] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const navigate = useNavigate();

  const handleFolderSelect = async () => {
    const folder = await window.electron.selectFolder();
    if (folder) {
      setFolderPath(folder);
    }
  };

  const handleScanFolder = async () => {
    if (!folderPath) {
      notification.error({
        message: 'Error',
        description: 'Please select a folder first.',
      });
      return;
    }

    const depth = 2; // Set your desired depth here or fetch from settings
    const scannedTree = await window.electron.scanFolder(folderPath, depth);
    console.log('Scanned file tree:', scannedTree); // Add logging here
    setFileTree(scannedTree);
  };

  const handleTest = async () => {
    if (!fileTree) {
      notification.error({
        message: 'Error',
        description: 'Please scan the folder first.',
      });
      return;
    }

    try {
      const instructions = await window.electron.getGPTInstructions(JSON.stringify(fileTree, null, 2));
      if (instructions) {
        notification.success({
          message: 'Success',
          description: 'Instructions received successfully.',
        });
        setResponse(JSON.stringify(instructions, null, 2));
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to get instructions.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while getting instructions.',
      });
      console.error('Error:', error);
    }
  };

  const handleExecuteInstructions = async () => {
    if (!response) {
      notification.error({
        message: 'Error',
        description: 'No instructions to execute.',
      });
      return;
    }
  
    try {
      const instructions = JSON.parse(response)['instruction_list']; // Correctly parse instruction_list
      await window.electron.executeInstructions({
        instructions,
        basePath: folderPath // Pass the base path
      });
      notification.success({
        message: 'Success',
        description: 'Instructions executed successfully.',
      });
      setExecutionResult('Instructions executed successfully.');
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while executing instructions.',
      });
      console.error('Error:', error);
      setExecutionResult('An error occurred while executing instructions.');
    }
  };
  
  

  return (
    <div className="test-gpt-container">
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>
      <h2>Test GPT Instructions</h2>
      <Button type="primary" onClick={handleFolderSelect} style={{ marginBottom: '20px' }}>
        Select Folder
      </Button>
      {folderPath && <p>Selected Folder: {folderPath}</p>}
      <Button type="primary" onClick={handleScanFolder} style={{ marginBottom: '20px' }}>
        Scan Folder
      </Button>
      {fileTree && (
        <div>
          <h3>File Tree:</h3>
          <pre>{JSON.stringify(fileTree, null, 2)}</pre>
        </div>
      )}
      <Button type="primary" onClick={handleTest} style={{ marginBottom: '20px' }}>
        Get GPT Instructions
      </Button>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
      {response && (
        <Button type="primary" onClick={handleExecuteInstructions} style={{ marginBottom: '20px' }}>
          Execute Instructions
        </Button>
      )}
      {executionResult && (
        <div>
          <h3>Execution Result:</h3>
          <p>{executionResult}</p>
        </div>
      )}
    </div>
  );
};

export default TestGPT;
