import React from 'react';
import { Input, Button, Checkbox } from 'antd';

const Organise = () => (
  <div className="organise">
    <Input placeholder="Choose your folder" />
    <Input placeholder="Choose your instructions preset" />
    <Checkbox>Take a backup of the folder</Checkbox>
    <Button type="primary">Start</Button>
  </div>
);

export default Organise;
