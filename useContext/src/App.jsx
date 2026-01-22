import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LiftingStateUpExample from './pages/LiftingStateUpExample';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/example-1-lifting-state-up" element={<LiftingStateUpExample />} />
      </Routes>
    </Router>
  );
}

export default App;
