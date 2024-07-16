import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import SetupScreen from './components/setup_screen/SetupScreen.tsx'
import {HashRouter, Routes, Route} from 'react-router-dom'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="/setup" element={<SetupScreen/>}/>
      </Routes>
    </HashRouter> 
  </React.StrictMode>,
)
