import EncryptedKeysData from '../models/EncryptedKeysData'
import ConnectionOptions from './ConnectionOptions'

export default interface BaseStorage {

    getKeyData(userId: string): Promise<EncryptedKeysData>

    addKeyData(keyData: EncryptedKeysData, userId: string): Promise<EncryptedKeysData>

    updateKeyData(keyData: EncryptedKeysData, userId: string): Promise<EncryptedKeysData>

    removeKeyData(userId: string): Promise<void>

    isDataExist(userId: string): Promise<boolean>

    connect(): Promise<void>

    close(): Promise<void>
}