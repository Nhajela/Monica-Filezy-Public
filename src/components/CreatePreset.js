import React, { useState } from 'react';
import { Input, Button } from 'antd';
import './CreatePreset.css';

const CreatePreset = () => {
  const [presetName, setPresetName] = useState('');
  const [customInstruction, setCustomInstruction] = useState('');

  const handleSavePreset = () => {
    // Logic to save the new preset to the config.json or server
    console.log('Preset saved:', { presetName, customInstruction });
  };

  return (
    <div className="create-preset-container">
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
