import cors from 'cors'
import config from '../Config'
import createError from '../utils/ErrorHelper'

const corsMiddleware = cors({
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        if (!config.corsWhitelist || config.corsWhitelist.length < 1 || config.corsWhitelist.includes(origin)) {
            callback(null, true)
        } else {
            callback(createError(401, `Origin ${origin} is blocked by CORS.`))
        }
    }
})

export default corsMiddleware