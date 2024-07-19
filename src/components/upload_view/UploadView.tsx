import Stack from "@mui/material/Stack"
import FileEntry from "../file_entry/FileEntry"
import { useEffect, useState } from "react"

interface fileDetails{
    name: string,
    size: string,
    uploadTime: string,
    pathURL: string,
    key: number
}

interface fileStatus {
    key: number,
    status: string
}

function UploadView(){
    const [files, setFiles] = useState<fileDetails[]>([])
    const [filesStatus, setFilesStatus] = useState<fileStatus[]>([])

    useEffect(() => {
        window.electronAPI.onFileUpload((fileDetails: fileDetails) => {
            setFiles([fileDetails,...files])
        })    
    }, [files])
    useEffect(() => {
        window.electronAPI.onFileUploadStatus((fileStatus: fileStatus) => {
            setFilesStatus([...filesStatus, fileStatus])
        })  
    }, [filesStatus])

    return(
        <Stack direction='column' spacing={2}>
            {files.map((fileDetails, index) => {
                let status = "pending"
                filesStatus.forEach((fileState, index) => {
                    if (fileState.key == fileDetails.key){
                        if (fileState.status != undefined) status = fileState.status
                    }
                })
                console.log("Add a component with name %s and key %d", fileDetails.name, fileDetails.key)
                console.log("Component with key %d have status:", fileDetails.key, status)
                return (
                    <FileEntry key={fileDetails.key} status={status} name={fileDetails.name} size={fileDetails.size} 
                    uploadTime={fileDetails.uploadTime} path={fileDetails.pathURL}/>
                )
            })}
        </Stack> 
    )
}

export default UploadView