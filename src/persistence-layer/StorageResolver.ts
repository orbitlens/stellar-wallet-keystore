import InMemoryStorage from './inmemory/InMemoryStorage'
import config from '../Config'
import BaseStorage from './BaseStorage'
import ConnectionOptions from './ConnectionOptions'

const options: ConnectionOptions = { connectionString: config.storageConnectionString }

const storageModuleName = `stellar-keystore-js-${config.storageProvider}`

let storage: BaseStorage
if (config.storageProvider === 'in-memory')
    storage = new InMemoryStorage()
else
    try {
        const storageModule = require(storageModuleName).default
        storage = new storageModule(options)
    } catch {
        throw new Error(`Storage module "${storageModuleName}" is not installed`)
    }

export default storage