import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Checkbox } from 'antd';
import { FolderOpenOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Organise.css';

const { Option } = Select;

const Organise = () => {
  const [folderPath, setFolderPath] = useState('');
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [backup, setBackup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load presets from config.json
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        setPresets(data.presets);
        setSelectedPreset(data.default_preset);
      });
  }, []);

  const handleFolderSelect = () => {
    // For Electron, use dialog to select folder
    // For web, you can use a file input or leave it as text input
    const folder = window.prompt('Select folder');
    if (folder) {
      setFolderPath(folder);
    }
  };

  const handlePresetChange = value => {
    if (value === 'create_new') {
      navigate('/create-preset');
    } else {
      setSelectedPreset(value);
    }
  };

  return (
    <div className="organise-container">
      <h2>Choose your folder</h2>
      <Input
        value={folderPath}
        placeholder="Select your folder"
        prefix={<FolderOpenOutlined onClick={handleFolderSelect} />}
        readOnly
      />

      <h2>Choose your instructions preset</h2>
      <Select
        value={selectedPreset}
        onChange={handlePresetChange}
        style={{ width: '100%' }}
      >
        {presets.map(preset => (
          <Option key={preset.id} value={preset.id}>
            {preset.name}
          </Option>
        ))}
        <Option key="create_new" value="create_new">
          Create new preset
        </Option>
      </Select>

      <Checkbox
        checked={backup}
        onChange={e => setBackup(e.target.checked)}
        style={{ marginTop: '20px' }}
      >
        Take a backup of the folder
      </Checkbox>

      <Button type="primary" style={{ marginTop: '20px' }}>
        Start
      </Button>
    </div>
  );
};

export default Organise;
