import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

// import './FileEntry.css'

interface fileInfo{
    name: string,
    uploadTime: string,
    size: string,
}

function FileEntry(props: fileInfo){
    const name = props.name
    const uploadTime = props.uploadTime
    const size = props.size
    return (
        <Paper className='file-entry'>
            <Stack direction='row' spacing={4}>
                <img src='https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg'
                className='image' width='75px' height='75px'/>
                <Stack>
                    <Typography>Name: {name}</Typography>
                    <Typography>Size: {size}</Typography>
                    <Typography>Upload Time: {uploadTime}</Typography>      
                </Stack>  
            </Stack>         
        </Paper>
    );
}

export default FileEntry;