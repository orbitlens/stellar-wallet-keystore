export default interface PutKeysRequest {
    encrypterName: string
    salt: string
    keysBlob: string
}