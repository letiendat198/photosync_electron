import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
// import './FolderEntry.css'

interface pathInformation{
    path: string
}

function FolderEntry(props: pathInformation){
    const path = props.path
    const [folderPath, setFolderPath] = useState(path)
    return (
        <Stack direction='row' alignItems='center'>
            <Checkbox defaultChecked onChange={() => {
                
            }}/>
            <Typography sx={{wordWrap: 'anywhere'}}>{path}</Typography>
        </Stack>
    );
}

export default FolderEntry;