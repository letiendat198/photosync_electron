import Add from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useState } from "react"
import { Link } from "react-router-dom"
import FolderEntry from "../folder_entry/FolderEntry"

interface folderDetails{
    path: string,
    key: number
  }

function FolderView(){
    const [folders, setFolder] = useState<folderDetails[]>([]) // USE SET INSTEAD

    const cancelFolder = (path: string) => {
        console.log("Canceling folder", path)

        let filteredFolder = folders.filter((folderDetails, index) => {
        if (folderDetails.path != path) return folderDetails
        })
        setFolder(filteredFolder)
    }
    return(
        <Stack sx={{maxHeight: '97vh', overflow: 'auto'}}>
            <Stack direction='row' spacing={2}>
                <Button variant='outlined' startIcon={<Add/>} 
                onClick={async () => {
                const folderDetails = await window.electronAPI.openFolder()
                if (folderDetails != null ){
                    setFolder([...folders, folderDetails])
                }
                }}> Add a folder </Button>
                <Button component={Link} to="/setup">Setup</Button>  
            </Stack>
            {folders.map((item, index) => {
                console.log("Add an entry for path %s with key", item.path, item.key)
                return (
                <FolderEntry key={item.key} path={item.path} onCancel={cancelFolder}/>
                )
            })}
        </Stack>
    )
}

export default FolderView