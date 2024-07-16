import { useState } from 'react'
import FolderEntry from './components/folder_entry/FolderEntry'
import FileEntry from './components/file_entry/FileEntry'
import {Link} from 'react-router-dom'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Add from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { Folder } from '@mui/icons-material';
// import './App.css'
// import './debugCSS.css'

function App() {
  const [folders, setFolder] = useState<string[]>([])
  return (
    <Container maxWidth={false} sx={{height: '100%', position: 'fixed'}}>
      <Grid container height='100%'>
        <Grid item xs={4}>
          <Stack sx={{maxHeight: '97vh', overflow: 'auto'}}>
            <Stack direction='row' spacing={2}>
              <IconButton onClick={async () => {
                const folderPath = await window.electronAPI.openFolder()
                setFolder([...folders, folderPath])
              }}>
                <Add/>
              </IconButton>
              <Button component={Link} to="/setup">Setup</Button>  
            </Stack>
            {folders.map((item, index) => {
              return (
                <FolderEntry path={item}/>
              )
            })}
          </Stack>
        </Grid>
        <Grid item xs={1} container direction='row' alignItems='center' justifyContent='center'>
          <Divider orientation='vertical'/>
        </Grid>
        <Grid item xs={7}>
          <Stack direction='column'>
            <FileEntry name='test.jpg' size='2MB' uploadTime='Today'/>
          </Stack> 
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
