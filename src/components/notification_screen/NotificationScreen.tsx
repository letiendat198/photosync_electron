import Stack from "@mui/material/Stack";
import UploadView from "../upload_view/UploadView";
import { Box, Card, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import './NotificationScreen.css'

function NotificationScreen(){
    return (
        <Stack spacing={1}>
            <Card sx={{
                backgroundColor: 'lightblue'
            }}>
                <Stack direction='row' alignItems='center' justifyContent='space-around'>
                    <Typography variant='h6'>Uploading new images...</Typography>   
                    <IconButton><CloseIcon/></IconButton>
                </Stack>    
            </Card>
            <Stack overflow='auto'>    
                <UploadView/> 
            </Stack>    
        </Stack>
        
    )
}

export default NotificationScreen