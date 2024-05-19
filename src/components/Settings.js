import React, { useState, useEffect } from 'react';
import { Input, Button, Select, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined } from '@ant-design/icons';
import './Settings.css';

const { Option } = Select;

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [presets, setPresets] = useState([]);
  const [defaultPreset, setDefaultPreset] = useState('');
  const [defaultBackup, setDefaultBackup] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load settings from config.json
    fetch('/config.json')
      .then(response => response.json())
      .then(data => {
        setApiKey(data.apiKey || '');
        setPresets(data.presets || []);
        setDefaultPreset(data.default_preset || '');
        setDefaultBackup(data.default_backup ? 'yes' : 'no');
      });
  }, []);

  const handleSaveSettings = () => {
    if (!apiKey || !defaultPreset || defaultBackup === '') {
      notification.error({
        message: 'Error',
        description: 'API Key, Default Preset, and Default Backup are required.',
      });
      return;
    }

    const backupBoolean = defaultBackup === 'yes';

    // Simulate saving to config.json
    fetch('/config.json') // In Electron, replace with fs.readFileSync
      .then(response => response.json())
      .then(data => {
        const updatedConfig = {
          ...data,
          apiKey,
          default_preset: defaultPreset,
          default_backup: backupBoolean,
        };

        // Here you would save updatedConfig to the config.json file
        // In Electron, replace with fs.writeFileSync
        console.log('Updated config:', updatedConfig);

        notification.success({
          message: 'Success',
          description: 'Settings saved successfully.',
        });

        // Navigate back to the previous page
        navigate(-1);
      })
      .catch(error => {
        notification.error({
          message: 'Error',
          description: 'Failed to save settings.',
        });
        console.error('Error saving settings:', error);
      });
  };

  return (
    <div className="settings-container">
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>
      <h2>Your OpenAI API Key</h2>
      <Input
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API key"
      />

      <h2>Your Default Instructions Preset</h2>
      <Select
        value={defaultPreset}
        onChange={setDefaultPreset}
        style={{ width: '100%' }}
      >
        {presets.map(preset => (
          <Option key={preset.id} value={preset.id}>
            {preset.name}
          </Option>
        ))}
      </Select>

      <h2>Default take a backup</h2>
      <Select
        value={defaultBackup}
        onChange={setDefaultBackup}
        style={{ width: '100%' }}
      >
        <Option value="yes">Yes</Option>
        <Option value="no">No</Option>
      </Select>

      <Button type="primary" onClick={handleSaveSettings} style={{ marginTop: '20px' }}>
        Save
      </Button>
    </div>
  );
};

export default Settings;
