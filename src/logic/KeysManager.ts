import storage from '../persistence-layer/StorageResolver'
import EncryptedKeysData from '../models/EncryptedKeysData'
import { HttpError } from '../utils/ApiErrorHandler'
import PutKeysRequest from '../models/PutKeysRequest'
import createError from '../utils/ErrorHelper'

class KeysManager {

    private async ensureUserHasKeyData(userId: string) {
        const exists = await storage.isDataExist(userId)
        if (!exists)
            throw new HttpError('User has no stored keys data', 400)
    }

    private async ensureUserHasNoKeysData(userId: string) {
        const exists = await storage.isDataExist(userId)
        if (exists)
            throw new HttpError('User already has stored keys data', 400)
    }

    private ensureUserIdIsValid(userId: string) {
        if (!userId)
            throw new Error('User id is empty or undefined')
    }

    private validateKeysRequest(putKeysRequest: PutKeysRequest) {
        const { encrypterName, salt, keysBlob } = putKeysRequest
        if (!encrypterName)
            throw createError(400, 'encrypterName is undefined')
        if (!salt)
            throw createError(400, 'salt is undefined')
        if (!keysBlob)
            throw createError(400, 'keysBlob is undefined')
    }

    async putKeys(putKeysRequest: PutKeysRequest, userId: string) {
        this.ensureUserIdIsValid(userId)

        if ((await storage.isDataExist(userId)))
            return await this.updateKeyData(putKeysRequest, userId)
        return await this.addKeyData(putKeysRequest, userId)
    }

    async getKeyData(userId: string) {
        this.ensureUserIdIsValid(userId)

        if (!(await storage.isDataExist(userId)))
            throw createError(404)
        await this.ensureUserHasKeyData(userId)
        return await storage.getKeyData(userId)
    }

    async addKeyData(putKeysRequest: PutKeysRequest, userId: string) {
        this.ensureUserIdIsValid(userId)

        await this.ensureUserHasNoKeysData(userId)

        this.validateKeysRequest(putKeysRequest)

        const { encrypterName, salt, keysBlob } = putKeysRequest
        const keyData: EncryptedKeysData = {
            encrypterName,
            salt,
            keysBlob,
            creationTime: '',
            modifiedTime: ''
        }

        return await storage.addKeyData(keyData, userId)
    }

    async updateKeyData(putKeysRequest: PutKeysRequest, userId: string) {
        this.ensureUserIdIsValid(userId)

        this.validateKeysRequest(putKeysRequest)

        const storedKeyData = await this.getKeyData(userId)

        const { encrypterName, salt, keysBlob } = putKeysRequest

        const keyData: EncryptedKeysData = {
            encrypterName,
            salt,
            keysBlob,
            creationTime: storedKeyData.creationTime,
            modifiedTime: storedKeyData.modifiedTime
        }

        return await storage.updateKeyData(keyData, userId)
    }

    async removeKeyData(userId: string) {
        this.ensureUserIdIsValid(userId)

        if (!(await storage.isDataExist(userId)))
            throw createError(404)

        await storage.removeKeyData(userId)
    }
}

export default new KeysManager()