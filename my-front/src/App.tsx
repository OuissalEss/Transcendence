import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/login" Component={LoginPage} />
        <Route path="/signup" Component={SignUpPage} />
        <Route path="/signin" Component={SignInPage} />
      </Routes>
    </Router>
  );
}

export default App;