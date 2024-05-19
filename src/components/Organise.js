import React, { useState, useEffect } from 'react';
import { Input, Button, Select, Checkbox } from 'antd';
import { FolderOpenOutlined,LeftOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './components.scss';

const { Option } = Select;

const Organise = () => {
  const [folderPath, setFolderPath] = useState('');
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [backup, setBackup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.readConfig().then(config => {
      setPresets(config.presets);
      setSelectedPreset(config.default_preset);
    });
  }, []);

  const handleFolderSelect = async () => {
    const folder = await window.electron.selectFolder();
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
      <Button
        type="link"
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>
      <h2>Choose your folder</h2>
      <div className="input-container">
        <Input
          value={folderPath}
          placeholder="Select your folder"
          suffix={<FolderOpenOutlined onClick={handleFolderSelect} />}
          readOnly
        />
      </div>

      <h2>Choose your instructions preset</h2>
      <div className="select-container">
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
      </div>

      <div className="checkbox-container">
        <Checkbox
          checked={backup}
          onChange={e => setBackup(e.target.checked)}
        >
          Take a backup of the folder
        </Checkbox>
      </div>

      <Button type="primary" className="start-button" onClick={()=>(navigate('/working'))}>
        Start
      </Button>
    </div>
  );
};

export default Organise;
