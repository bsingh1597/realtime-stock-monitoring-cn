import './App.css';
import ChatRoom from './components/ChatRoom';
import NavBar from './components/NavBar';
import StockClient from './components/StockClient';

function App() {
  return (
    <div className="App">
      <NavBar/>
      <StockClient/>
      <ChatRoom></ChatRoom>
    </div>
  );
}

export default App;
