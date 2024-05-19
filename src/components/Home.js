import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';
import sparkleIcon from '../assets/sparkle-icon.svg';
import settingsIcon from '../assets/settings-icon.svg';
import contactIcon from '../assets/contact-icon.svg';
import girlImage from '../assets/girl.png';
import './components.scss';

const Home = () => (
  <div className="home-container">
    <img src={girlImage} alt="Girl" className="girl-image" />
    <h1>Hi, I'm Monica Files!</h1>
    <p>I'll arrange your folders as if they were my folders :)</p>
    <div className="button-group">
      <Link to="/organise">
        <Button type="primary" icon={<img src={sparkleIcon} alt="Organise" className="icon" />}>Organise My Files</Button>
      </Link>
      <Link to="/settings">
        <Button type="default" icon={<SettingOutlined />}>Settings</Button>
      </Link>
    </div>
    <div className="contact-dev">
      <Link to="/contact">
        <Button icon={<img src={contactIcon} alt="Contact Dev" className="icon" />}>Contact dev</Button>
      </Link>
    </div>
  </div>
);

export default Home;
