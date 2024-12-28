import { useState } from 'react';
import Image from 'react';
import './App.css'
import fflogo from './assets/fflogo.png';
import Clock from './components/Clock'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Clock></Clock>
        <a href="https://cytu.be/r/Fancutfags" target="_blank" rel="noopener noreferrer"><img src={fflogo} className='fflogo'></img></a>
      </div>
    </>
  )
}

export default App
