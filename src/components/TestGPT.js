import React, { useState } from 'react';
import { Input, Button, notification } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './components.scss';

const { TextArea } = Input;

const TestGPT = () => {
  const [fileTree, setFileTree] = useState('');
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleTest = async () => {
    try {
      const instructions = await window.electron.getGPTInstructions(fileTree);
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
      <TextArea
        value={fileTree}
        onChange={e => setFileTree(e.target.value)}
        placeholder="Enter your file tree"
        rows={4}
        style={{ marginTop: '10px', marginBottom: '20px' }}
      />
      <Button type="primary" onClick={handleTest} style={{ marginBottom: '20px' }}>
        Test
      </Button>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default TestGPT;
