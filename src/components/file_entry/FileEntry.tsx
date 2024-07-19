import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Box, CircularProgress, Container, Grid, Icon, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close';

// import './FileEntry.css'

interface fileInfo{
    name: string,
    uploadTime: string,
    size: string,
    status: string,
    path: string
}

function FileEntry(props: fileInfo){
    const name = props.name
    const uploadTime = props.uploadTime
    const size = props.size
    const path = props.path
    const status = props.status

    // display=flex in 1st grid-item to wrap children
    // Image: width=100% to fill grid width. Only set width to preserve aspect ratio
    // Somehow height=100% not work. Apparently Grid height is not concretly set so % do nothing
    return (
        <Paper className='file-entry'>
            <Grid container spacing={1}>
                <Grid item xs={4} display='flex'>
                    <Box component='img' src={path} width='100%'/>    
                </Grid>
                <Grid item xs={6}>
                <Stack>
                        <Typography textOverflow='ellipsis' noWrap>Name: {name}</Typography>
                        <Typography>Size: {size}</Typography>
                        <Typography textOverflow='ellipsis' noWrap>Upload Time: {uploadTime}</Typography>      
                    </Stack>   
                </Grid>
                <Grid item xs = {2} position='relative'>
                    {status!="pending"?
                    <Icon sx={{
                        position: 'absolute',
                        top: '20%',
                        right: '20%'
                    }}>{status=="success"?<CheckIcon fontSize='medium' color='success'/>
                        :<CloseIcon fontSize='medium' color='error'/>}
                    </Icon>:
                    <CircularProgress size={30} sx={{
                        position: 'absolute',
                        top: '20%',
                        right: '15%'
                    }}/>}
                </Grid>             
            </Grid>      
        </Paper>
    );
}

export default FileEntry;