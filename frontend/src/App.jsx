import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import MapComponent from './components/MapComponent'

function App() {
  return (
    <div className="App">
      <h1>מערכת מעקב תלמידות</h1>
      <MapComponent/>
    </div>
  )
}

export default App