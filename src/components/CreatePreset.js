import React, { useState } from 'react';
import { Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import './CreatePreset.css';

const CreatePreset = () => {
  const [presetName, setPresetName] = useState('');
  const [customInstruction, setCustomInstruction] = useState('');
  const navigate = useNavigate();

  const handleSavePreset = () => {
    if (!presetName || !customInstruction) {
      notification.error({
        message: 'Error',
        description: 'Both fields are required.',
      });
      return;
    }

    // Simulate saving to config.json
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        const newPreset = {
          id: data.presets.length + 1,
          name: presetName,
          custom_instruction: customInstruction,
        };
        const updatedPresets = [...data.presets, newPreset];

        // Here you would save updatedPresets to the config.json file
        // For this example, we just log it to the console
        console.log('Updated presets:', updatedPresets);

        notification.success({
          message: 'Success',
          description: 'Preset saved successfully.',
        });

        // Redirect back to Organise page
        navigate('/organise');
      })
      .catch(error => {
        notification.error({
          message: 'Error',
          description: 'Failed to save preset.',
        });
        console.error('Error saving preset:', error);
      });
  };

  return (
    <div className="create-preset-container">
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>
      <h2>Create New Preset</h2>
      <Input
        value={presetName}
        onChange={e => setPresetName(e.target.value)}
        placeholder="Preset Name"
      />
      <Input.TextArea
        value={customInstruction}
        onChange={e => setCustomInstruction(e.target.value)}
        placeholder="Custom Instruction"
        rows={4}
        style={{ marginTop: '10px' }}
      />
      <Button type="primary" onClick={handleSavePreset} style={{ marginTop: '20px' }}>
        Save
      </Button>
    </div>
  );
};

export default CreatePreset;
