import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// import './SetupScreen.css'

function SetupScreen(){
    const navigate = useNavigate()

    return (
        <Box display='flex' alignItems='center' justifyContent='center' width='100%' height='100%' position='fixed'>
            <Stack alignItems='center' justifyContent='center' spacing={2}>
                <Typography variant='h3'>Photosync</Typography>
                <Typography>Enter client ID and client secret to continue</Typography>
                <TextField variant='outlined' label='client_id'></TextField>
                <TextField variant='outlined' label='client_secret'></TextField>
                <Stack direction='row' spacing={2}>
                    <Button variant='contained' onClick={() => navigate("/")}>Submit</Button>
                    <Button variant='outlined'>Import secret.json</Button>
                </Stack>  
            </Stack>
        </Box>
    )
}

export default SetupScreen