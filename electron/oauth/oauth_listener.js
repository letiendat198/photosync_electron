import http from 'http'
import { parentPort } from 'worker_threads'

const port = 1908

http.createServer((req, res) => {
    console.log(req.url)

    res.writeHead(200)
    res.write("You can now close this window")
    res.end()

    const fullUrl = req.headers.host + req.url
    const urlParams = new URL(fullUrl).searchParams
    const code = urlParams.get("code")
    parentPort.postMessage(code)
}).listen(port, () => {
    console.log("OAuth listener is listening on port", port)
})