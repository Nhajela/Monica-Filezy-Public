import React from 'react';
import { Input, Button, Checkbox } from 'antd';

const Settings = () => (
  <div className="settings">
    <Input placeholder="Your OpenAI API key" />
    <Input placeholder="Your default instructions preset" />
    <Checkbox>Default take a backup</Checkbox>
    <Button type="primary">Save</Button>
  </div>
);

export default Settings;
