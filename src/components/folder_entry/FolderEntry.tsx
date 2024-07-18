import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FolderOutlined from '@mui/icons-material/FolderOutlined';
import Icon from '@mui/material/Icon';
import { useState } from 'react';
// import './FolderEntry.css'

interface pathInformation{
    path: string
    onCancel: (path: string) => void
}

function FolderEntry(props: pathInformation){
    const path = props.path
    return (
        <Stack direction='row' alignItems='center' spacing={1}>
            <Checkbox defaultChecked onChange={(event) => {
                props.onCancel(path)
                const folderStatus = event.target.checked
                window.electronAPI.folderStatusChange(folderStatus, path)  
            }}/>
            <Icon><FolderOutlined/></Icon>
            <Typography sx={{wordWrap: 'anywhere'}}>{path}</Typography>
        </Stack>
    );
}

export default FolderEntry;