import KeyManager from './KeysManager'
import StorageResolver from '../persistence-layer/StorageResolver'
import { expect } from 'chai'
import 'mocha'

const testUser = 'test-user'

describe('KeysManager', () => {

    before(async () => {
        await StorageResolver.connect()
    })

    it('should fail to fetch data', async () => {
        let result = null
        try {
            result = await KeyManager.getKeyData(testUser)
        } catch (e) {
            result = e
        }

        expect(result).is.a(Error.name)
    })

    it('should fail to delete data', async () => {
        let result = null
        try {
            result = await KeyManager.removeKeyData(testUser)
        } catch (e) {
            result = e
        }

        expect(result).is.a(Error.name)
    })

    it('should fail to add data without user', async () => {
        let result = null
        try {
            result = await KeyManager.putKeys({
                encrypterName: 'test',
                salt: 'test2',
                keysBlob: 'test3'
            }, '')
        } catch (e) {
            result = e
        }

        expect(result).is.a(Error.name)
    })


    it('should fail to add invalid data', async () => {
        let result = null
        try {
            result = await KeyManager.putKeys(<any>{
                encrypterName: null,
                salt: null,
                keysBlob: null
            }, testUser)
        } catch (e) {
            result = e
        }

        expect(result).is.a(Error.name)
    })

    it('should add data', async () => {
        const result = await KeyManager.putKeys({
            encrypterName: 'test',
            salt: 'test2',
            keysBlob: 'test3'
        }, testUser)

        expect(result).is.a(Object.name)
    })

    it('should fetch data', async () => {
        const result = await KeyManager.getKeyData(testUser)
        expect(result).is.a(Object.name)
    })

    it('should update data', async () => {

        const newSalt = Date.now().toString()

        let result = await KeyManager.putKeys({
            encrypterName: 'test',
            salt: newSalt,
            keysBlob: 'test3'
        }, testUser)

        expect(result).is.a(Object.name)

        result = await KeyManager.getKeyData(testUser)

        expect(result.salt).eq(newSalt)
    })



    it('should delete data', async () => {
        await KeyManager.removeKeyData(testUser)
    })

    after(async () => {
        await StorageResolver.close()
    })

})