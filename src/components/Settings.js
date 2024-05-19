import React, { useState, useEffect } from 'react';
import { Input, Button, Select, notification, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, DeleteOutlined } from '@ant-design/icons';
import './components.scss';

const { Option } = Select;

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [presets, setPresets] = useState([]);
  const [defaultPreset, setDefaultPreset] = useState('');
  const [defaultBackup, setDefaultBackup] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.readConfig().then(config => {
      setApiKey(config.apiKey || '');
      setPresets(config.presets || []);
      setDefaultPreset(config.default_preset || '');
      setDefaultBackup(config.default_backup ? 'yes' : 'no');
    }).catch(error => {
      console.error('Error reading config:', error);
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

    window.electron.readConfig().then(config => {
      const updatedConfig = {
        ...config,
        apiKey,
        default_preset: defaultPreset,
        default_backup: backupBoolean,
      };

      window.electron.writeConfig(updatedConfig);

      notification.success({
        message: 'Success',
        description: 'Settings saved successfully.',
      });

      navigate(-1);
    }).catch(error => {
      notification.error({
        message: 'Error',
        description: 'Failed to save settings.',
      });
      console.error('Error saving settings:', error);
    });
  };

  const handleDeletePreset = (presetId) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this preset?',
      onOk: () => {
        window.electron.readConfig().then(config => {
          const updatedPresets = config.presets.filter(preset => preset.id !== presetId);
          const updatedConfig = {
            ...config,
            presets: updatedPresets,
          };

          window.electron.writeConfig(updatedConfig);
          setPresets(updatedPresets);

          if (defaultPreset === presetId) {
            setDefaultPreset('');
          }

          notification.success({
            message: 'Success',
            description: 'Preset deleted successfully.',
          });
        }).catch(error => {
          notification.error({
            message: 'Error',
            description: 'Failed to delete preset.',
          });
          console.error('Error deleting preset:', error);
        });
      }
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
            {preset.name} <DeleteOutlined onClick={() => handleDeletePreset(preset.id)} />
          </Option>
        ))}
        <Option key="create_new" value="create_new">
          Create new preset
        </Option>
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
