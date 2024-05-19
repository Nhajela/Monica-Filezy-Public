import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Organise from './components/Organise';
import Settings from './components/Settings';
import Working from './components/Working';
import Finished from './components/Finished';
import Error from './components/Error';
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
    </Routes>
  </Router>
);

export default App;
