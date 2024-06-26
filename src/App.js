import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Organise from './components/Organise';
import Settings from './components/Settings';
import Working from './components/Working';
import Finished from './components/Finished';
import Error from './components/Error';
import Feedback from './components/Feedback';
import CreatePreset from './components/CreatePreset';
import TestGPT from './components/TestGPT';
import 'antd/dist/reset.css';
import './App.css';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/organise" element={<Organise />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/working" element={<Working />} />
      <Route path="/finished" element={<Finished />} />
      <Route path="/error" element={<Error />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/create-preset" element={<CreatePreset />} />
      <Route path="/test-gpt" element={<TestGPT />} />
    </Routes>
  </Router>
);

export default App;
