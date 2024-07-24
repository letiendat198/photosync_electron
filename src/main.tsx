import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import SetupScreen from './components/setup_screen/SetupScreen.tsx'
import {HashRouter, Routes, Route} from 'react-router-dom'
import NotificationScreen from './components/notification_screen/NotificationScreen.tsx'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: "#33658A"
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App/>}/>
          <Route path="/setup" element={<SetupScreen/>}/>
          <Route path="/notification" element={<NotificationScreen/>}/>
        </Routes>
      </HashRouter>   
    </ThemeProvider>
  </React.StrictMode>,
)
