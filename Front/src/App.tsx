import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GirlImage from './assets/Girl.png';
import LogoImage from './assets/Logo.png';
import TitleImage from './assets/Title.png';
import Login from './Login.tsx';
import Start from './Start.tsx';
import Dashboard from './Dashboard.tsx';
import './App.css';
import Settings from './Settings.tsx';
import Profile from './Profile.tsx';
import Pprofile from './Pprofile.tsx';

function Landing() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="TextContainer">
          <p className="TextLine">Bounce into Brilliance:</p>
          <p className="TextLine">Your Destination for Ping Pong Excitement!</p>
        </div>
        <img src={GirlImage} className="GirlImage" alt="GirlImage" />
        <img src={LogoImage} className="LogoImage" alt="LogoImage" />
        <img src={TitleImage} className="TitleImage" alt="TitleImage" />
        <Link to="/start">
          <button className="GetStartedButton">Get Started</button>
        </Link>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/start" element={<Start />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pprofile" element={<Pprofile />} />
      </Routes>
    </Router>
  );
}

export default App;
