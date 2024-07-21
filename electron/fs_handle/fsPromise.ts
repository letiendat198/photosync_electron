import fs from 'node:fs'

function readFilePromise(path: string): Promise<Buffer|null>{
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, buffer) => {
            if (err){
                reject(err)
            }
            else{
                resolve(buffer)
            }
        })
    })
}    
const fsPromise = {
    readFilePromise
}
export default fsPromise