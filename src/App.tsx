import FileEntry from './components/file_entry/FileEntry'
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import FolderView from './components/folder_view/FolderView';
import UploadView from './components/upload_view/UploadView';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './debugCSS.css'

function App() {
  let navigate = useNavigate()
  useEffect(() => {
    window.electronAPI.onRouteSetup(() => {
      navigate("/setup")
    })
    window.electronAPI.onRouteNotification(() => {
      navigate("/notification")
    })
    return () => {
      window.electronAPI.removeListenerForChannel('route:setup')
      window.electronAPI.removeListenerForChannel('route:notification')
    }
  }, [])

  return (
    <Container maxWidth={false} sx={{height: '100%', position: 'fixed'}}>
      <Grid container height='100%'>
        <Grid item xs={6}>
          <Typography variant='h6'>Folder Watch List</Typography>
          <FolderView/>
        </Grid>
        <Grid item xs={1} container direction='row' alignItems='center' justifyContent='center'>
          <Divider orientation='vertical'/>
        </Grid>
        <Grid item xs={5} height='97vh' overflow='auto'>
          <Typography variant='h6'>Upload History</Typography>
          <UploadView/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
