const https = require('https')

async function request({
    apiToken,
    hostname = 'api.tidbyt.com',
    port = '443',
    path,
    method = 'GET',
    headers = {},
    body = null,
    raw = false,
    encoding = 'utf-8',
}) {
    const httpOptions = {
        hostname,
        port,
        path,
        method,
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            ...headers,
        }
    }
    if (!apiToken) throw new Error('apiToken is required')
    if (!path) throw new Error('path is required')
    return new Promise((resolve, reject) => {
        const request = https.request(httpOptions, (res) => {
            let responseBufs = []
            let responseStr = ''
            res.on('data', (chunk) => {
                if (Buffer.isBuffer(chunk)) {
                    responseBufs.push(chunk)
                }
                else {
                    responseStr = responseStr + chunk;           
                }
            }).on('end', () => {
                const buf = Buffer.concat(responseBufs)

                if (raw) {
                    return resolve(buf)
                }

                responseStr = responseBufs.length > 0 ? buf.toString(encoding) : responseStr
                
                const response = JSON.parse(responseStr)
                if (res.statusCode >= 400) {
                    const error = new Error(`${response.message || res.statusMessage}`)
                    error.code = response.code || res.statusCode
                    error.statusCode = res.statusCode
                    return reject(error)
                }    
                resolve(response)
            })
            
        })
        .setTimeout(0)
        .on('error', reject)
        if (body) {
            request.write(JSON.stringify(body))
        }
        request.end() 
    })
}

module.exports = request