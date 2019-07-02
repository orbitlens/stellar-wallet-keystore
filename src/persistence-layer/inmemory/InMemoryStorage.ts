import EncryptedKeysData from '../../models/EncryptedKeysData'
import BaseStorage from '../BaseStorage'

interface KeyStore {
    [publicKey: string]: EncryptedKeysData
}

function getNow() {
    return (new Date()).toISOString()
}

export default class InMemoryStorage implements BaseStorage {
    constructor() {
        this.keyStore = {}
    }

    private keyStore: KeyStore

    async getKeyData(userId: string) {
        return await Promise.resolve(this.keyStore[userId])
    }

    async addKeyData(keyData: EncryptedKeysData, userId: string) {
        keyData.creationTime = keyData.modifiedTime = getNow()
        this.keyStore[userId] = keyData
        return await Promise.resolve(keyData)
    }

    async updateKeyData(keyData: EncryptedKeysData, userId: string) {
        keyData.modifiedTime = getNow()
        this.keyStore[userId] = keyData
        return await Promise.resolve(keyData)
    }

    async removeKeyData(userId: string) {
        if (this.keyStore[userId])
            delete this.keyStore[userId]

        await Promise.resolve()
    }

    async isDataExist(userId: string) {
        return await Promise.resolve(!!this.keyStore[userId])
    }

    async connect() {
        await Promise.resolve()
    }

    async close() {
        await Promise.resolve()
    }
}