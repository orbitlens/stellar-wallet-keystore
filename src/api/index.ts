import keysRoutes from './routes/Keys' 
import express from 'express'

let apiRouter = express.Router()
keysRoutes(apiRouter)

export default apiRouter