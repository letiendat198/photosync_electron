import Stack from "@mui/material/Stack"
import FileEntry from "../file_entry/FileEntry"
import { useEffect, useReducer, useState } from "react"

interface fileDetails{
    name: string,
    size: string,
    uploadTime: string,
    pathURL: string,
    key: number,
    status: string
}

interface fileStatus {
    [key: number]: string
}

function UploadView(){
    const [files, setFiles] = useState<fileDetails[]>([])
    const [status, setStatus] = useState<fileStatus>({[-1]: "pending"})

    const reset = () => {
        setFiles([])
        setStatus({[-1]: "pending"})
    }
    
    useEffect(() => {     
        window.electronAPI.onFileUpload((fileDetails: fileDetails) => {
            console.log("Add a file called")
            setFiles((files) => {
                console.log(files)
                return [fileDetails, ...files]
            })
            setStatus((status) => {
                return({...status, [fileDetails.key]: "pending"})
            })
        })
        // Need to unsubscribe when cleaning up
        // Otherwise, when useEffect is called twice in StrictMode, listener will pile on top
        // of each other and will add twice the entry
        return () => {
            window.electronAPI.removeListenerForChannel('event:fileUpload')
        }      
    }, [])
    useEffect(() => {
        window.electronAPI.onFileUploadStatus((fileStatus: any) => {
            console.log("File status for %d changed to %s", fileStatus.key, fileStatus.status)
            setStatus((status) => {
                return({...status, [fileStatus.key]: fileStatus.status})
            })
        })
        return () => {
            window.electronAPI.removeListenerForChannel('event:fileUploadStatus')
        }
    }, [])

    return(
        <Stack direction='column' spacing={2}>
            {files.map((fileDetails, index) => {
                console.log("Add a component with name %s and key %d", fileDetails.name, fileDetails.key)
                console.log("Component with key %d have status:", fileDetails.key, status[fileDetails.key])
                return (
                    <FileEntry key={fileDetails.key} status={status[fileDetails.key]} name={fileDetails.name} size={fileDetails.size} 
                    uploadTime={fileDetails.uploadTime} path={fileDetails.pathURL}/>
                )
            })}
        </Stack> 
    )
}

export default UploadView