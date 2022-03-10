import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom'
import OtherPage from './OtherPage';
import Fib from './Fib';
import Testpage from './Testpage';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link to="/">Home</Link>
        <Link to="/OtherPage">Other Page</Link>
      </header>
      <div>
        <Routes>
          <Route exact path="/" element={<Fib />}></Route>
          <Route path="/test" element={<Testpage />}></Route>
          <Route path="/otherpage" element={<OtherPage />}></Route>
        </Routes>
        </div>
    </div>
    </Router>
  );
}

export default App;
