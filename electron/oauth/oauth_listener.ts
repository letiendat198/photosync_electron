import http from 'http'

const port = 1908
let server: http.Server

function oauthCodeListener(): Promise<string>{
    server = http.createServer()
    try{
        server.listen(port)
    }
    catch(err){
        console.log("Server already listening")
    }
    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            server.close()
            reject(new Error("Listener timeout"))
        }, 5*6000)
        server.on('request',(req, res) => {
            console.log(req.url)
            res.writeHead(200)
            res.write("You can now close this window")
            res.end()
            
            if (req.headers.host && req.url){
                const fullUrl = req.headers.host + req.url
                const urlParams = new URL(fullUrl).searchParams
                const code = urlParams.get("code")
                if (code){
                    clearTimeout(timer)
                    resolve(code)    
                } 
                else{
                    clearTimeout(timer)
                    reject(new Error("Something went wrong when listening"))    
                } 
                server.close()
            }
        })  
    })
}

export default oauthCodeListener