import Stack from "@mui/material/Stack";
import UploadView from "../upload_view/UploadView";
import { AppBar, Box, Card, IconButton, Toolbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
// import './NotificationScreen.css'

function NotificationScreen(){
    const [key, setKey] = useState(0)

    useEffect(() => {
        window.electronAPI.onNotificationReset(() => {
            setKey(c=>c+1)
        })
        return () => {
            window.electronAPI.removeListenerForChannel('event:resetNotification')
        }
    }, [])

    // Reseting component with key change is dark magic!
    return (
        <Stack spacing={1}>
            <AppBar position="sticky" sx={{zIndex: 10}} elevation={0}>
                <Toolbar>
                    <Typography sx={{flexGrow: 1}}>Uploading new images...</Typography>
                    <IconButton color="inherit" onClick={() => {
                        setKey(c=>c+1)
                        window.electronAPI.closeNotificationWindow()
                    }}>
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Stack>    
                <UploadView key={key}/>
            </Stack>    
        </Stack>
        
    )
}

export default NotificationScreen