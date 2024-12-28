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
        <img src={fflogo} className='fflogo'></img>
      </div>
    </>
  )
}

export default App
