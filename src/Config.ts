import defaultConfig from './app.config.json'

interface RawConfig {
    [key: string]: any
}

const rawConfigObject: RawConfig = defaultConfig

function camelCase(value: string) {
    return value.toLowerCase().replace(/_([a-z])/g, (x, up) => up.toUpperCase())
}

function parseEnv(key: string, cb?: (key: string, value: any, config: any) => void) {
    let value: any = process.env[key]
    if (value) {
        const path = camelCase(key),
            defaultValue = rawConfigObject[path]
        if (typeof defaultValue === 'number') {
            value = parseInt(value)
        } else if (defaultValue.constructor === Array) {
            value = (value || '').split(',')
        }
        if (typeof cb === 'function') {
            cb(key, value, rawConfigObject)
        } else {
            rawConfigObject[path] = value
        }
    }
}

parseEnv('STORAGE_PROVIDER')
parseEnv('STORAGE_CONNECTION_STRING')
parseEnv('API_PORT')
parseEnv('CORS_WHITELIST')
parseEnv('AUTHENTICATOR_API_TYPE', (key, value, conf) => conf.authenticator.APIType = Number(value))
parseEnv('AUTHENTICATOR_URL', (key, value, conf) => conf.authenticator.URL = value)

export enum APIType {
    Undefined = 0,
    REST = 1,
    GraphQL = 2
}

export class Authenticator {
    APIType: APIType = APIType.Undefined
    URL: string = ''
}

export class Config {
    storageProvider: string = 'in-memory'
    storageConnectionString: string = ''
    apiPort: number = 0
    corsWhitelist: string[] = []
    authenticator: Authenticator = new Authenticator()
}

const config = new Config()
Object.assign(config, rawConfigObject)

export default config