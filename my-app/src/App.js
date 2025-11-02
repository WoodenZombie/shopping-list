import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShoppingListDetail from './ShoppingListDetail';
import ShoppingListsPage from './ShoppingListsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/lists" replace />} />
          <Route path="/lists" element={<ShoppingListsPage />} />
          <Route path="/list/:id" element={<ShoppingListDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
