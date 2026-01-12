import { Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavigationBar/NavBar';
import Home from './pages/Home';
import Coin from './pages/Coin';
import Footer from './components/Footer/Footer'
function App() {

  return (
    <div className='app'>
      <NavBar/>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/coin/:coinId' element = {<Coin/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
