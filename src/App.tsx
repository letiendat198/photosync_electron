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
  let key = 0
  const cancelFolder = (path: string) => {
    console.log("Canceling folder", path)
    let pathIndex = folders.indexOf(path)
    console.log(pathIndex)
    folders.splice(pathIndex, 1) // This will return deleted elements, not new array!
    setFolder([...folders])
  }

  return (
    <Container maxWidth={false} sx={{height: '100%', position: 'fixed'}}>
      <Grid container height='100%'>
        <Grid item xs={6}>
          <Stack sx={{maxHeight: '97vh', overflow: 'auto'}}>
            <Stack direction='row' spacing={2}>
              <Button variant='outlined' startIcon={<Add/>} 
              onClick={async () => {
                const folderPath = await window.electronAPI.openFolder()
                if (folderPath != null ){
                  key += 1
                  setFolder([...folders, folderPath])
                }
              }}> Add a folder </Button>
              <Button component={Link} to="/setup">Setup</Button>  
            </Stack>
            {folders.map((item, index) => {
              console.log(key)
              return (
                <FolderEntry key={key} path={item} onCancel={cancelFolder}/>
              )
            })}
          </Stack>
        </Grid>
        <Grid item xs={1} container direction='row' alignItems='center' justifyContent='center'>
          <Divider orientation='vertical'/>
        </Grid>
        <Grid item xs={5}>
          <Stack direction='column'>
            <FileEntry name='test.jpg' size='2MB' uploadTime='Today'/>
          </Stack> 
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
