import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Assignment_1 from './assignment/Assignment_1.jsx';
import Assignment_2 from './assignment/Assignment_2.jsx';
import Assignment_3 from './assignment/Assignment_3.jsx';
import Assignment_4 from './assignment/Assignment_4.jsx';
import Assignment_5 from './assignment/Assignment_5.jsx';
import Assignment_6 from './assignment/Assignment_6.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/assignment_1" element={<Assignment_1 />} />
        <Route path="/assignment_2" element={<Assignment_2 />} />
        <Route path="/assignment_3" element={<Assignment_3 />} />
        <Route path="/assignment_4" element={<Assignment_4 />} />
        <Route path="/assignment_5" element={<Assignment_5 />} />
        <Route path="/assignment_6" element={<Assignment_6 />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
