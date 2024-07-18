import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Card from '@mui/material/Card'
import Paper from '@mui/material/Paper'
import Fab from '@mui/material/Fab'
import { Icon } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CheckCircleRounderIcon from '@mui/icons-material/CheckCircleRounded'

// import './SetupScreen.css'

function SetupScreen(){
    const navigate = useNavigate()
    const [clientID, setClientID] = useState("")
    const [clientSecret, setClientSecret] = useState("")

    const [modalOpen, setModalOpen] = useState(false)
    const handleOpen = () => setModalOpen(true)
    const handleClose = () => setModalOpen(false)

    const [modalText, setModalText] = useState("")
    const [setupState, setSetupState] = useState(false)

    useEffect(() => {
        async function checkCachedSecret(){
            const secret = await window.electronAPI.checkCachedSecret()
            if (secret!=null){
                setClientID(secret.client_id)
                setClientSecret(secret.client_secret)
            }
        }
        checkCachedSecret()
    }, [])

    window.electronAPI.onModalTextUpdate((text: string) => {
        console.log("event:modalTextUpdate invoked")
        setModalText(text)
    })

    window.electronAPI.onSetupComplete(() => {
        console.log("event:setupComplete invoked")
        setSetupState(true)
        setTimeout(()=>navigate("/"),5000)
    })

    return (
        <Box display='flex' alignItems='center' justifyContent='center' width='100%' height='100%' position='fixed'>
            <Stack alignItems='center' justifyContent='center' spacing={2}>
                <Typography variant='h3'>Photosync</Typography>
                <Typography>Enter client ID and client secret to continue</Typography>
                <TextField variant='outlined' label='client_id' value={clientID} onChange={(event)=>{
                    setClientID(event.target.value)
                }}></TextField>
                <TextField variant='outlined' label='client_secret' value={clientSecret} onChange={(event)=>{
                    setClientSecret(event.target.value)
                }}></TextField>
                <Stack direction='row' spacing={2}>
                    <Button variant='contained' onClick={() => {
                        window.electronAPI.submitClientDetails(clientID, clientSecret)
                        setSetupState(false)
                        handleOpen()
                    }}>Submit</Button>
                    <Button variant='outlined'>Import secret.json</Button>
                </Stack>  
            </Stack>
            <Modal open={modalOpen} aria-labelledby="modal-title" disableEscapeKeyDown>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 300,
                    outline: 0
                }}>
                    <Card>
                        <Stack direction='column' alignItems='center' justifyContent='center' spacing={2} marginBottom='5%' marginTop='5%'>
                            <Typography id="modal-title" variant='h6' component='h2'>Requesting API Access</Typography>                                                    
                            {!setupState?(<CircularProgress/>):(
                                <Fab color='success'>
                                    <CheckIcon/>
                                </Fab>   
                            )}
                            <Typography>{modalText}</Typography>
                        </Stack>
                    </Card>        
                </Box>
            </Modal>
        </Box>
        
    )
}

export default SetupScreen