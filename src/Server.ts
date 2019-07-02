process.env.NODE_ENV = process.env.NODE_ENV || 'production'

import express from 'express'
import errorHandler from './utils/ApiErrorHandler'
import createError from './utils/ErrorHelper'
import bodyParser from 'body-parser'
import config from './Config'
import http, {Server as NetServer} from 'http'
import corsMiddleware from './middlewares/CorsMiddleware'

import storage from './persistence-layer/StorageResolver'

import api from './api'

function normalizePort(value: string | number) {
    let port = parseInt(value.toString())
    if (isNaN(port) || port <= 0)
        throw new Error('Invalid port')
    return port
}

async function closeStorage() {
    await storage.close()
}

async function gracefulExit(exitCode = 0) {
    //exit in any case in 3 seconds
    setTimeout(() => {
        console.error('Failed to perform clean exit')
        process.exit(-1)
    }, 3000)

    await closeStorage()
    process.exit(exitCode)
}

export default class Server {

    private server: NetServer | undefined
    
    app = express()

    async start() {

        await storage.connect()

        process.on('uncaughtException', async err => {
            console.error(err)
            await gracefulExit(1)
        })

        process.on('unhandledRejection', async (reason: any, promise) => {
            console.error(`Unhandled Rejection at: ${promise} reason: ${reason.stack || reason}.`)
            await gracefulExit(1)
        })

        process.on('message', msg => {
            if (msg === 'shutdown') { //message from pm2
                gracefulExit()
            }
        })
        process.on('SIGINT', () => gracefulExit())
        process.on('SIGTERM', () => gracefulExit())

        this.app.disable('x-powered-by')

        this.app.use(corsMiddleware)

        this.app.use(bodyParser.urlencoded({
            extended: true
        }))
        this.app.use(bodyParser.json())

        this.app.use('/api', api)

        /*for 404 errors catching*/
        this.app.use(handler => {
            handler.next && handler.next(createError(404, ''))
        })

        this.app.use(errorHandler())

        const port = normalizePort(process.env.PORT || config.apiPort || 3000)
        this.app.set('port', port)


        this.server = http.createServer(this.app)

        this.server.listen(port)

        this.server.on('listening', () => {
            let addr = this.server && this.server.address()
            if (!addr)
                throw new Error('Unable to obtain address from server')
            const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
            console.log('Listening on ' + bind)
        })
    }

    async shutdown(code?: number) {
        gracefulExit(code)
    }
}
