# stellar-wallet-keystore

JS implementation of the keystore service compatible with the [official Stellar WalletSDK Keystore](https://github.com/stellar/go/blob/master/services/keystore/spec.md).

## Configuration

All configuration parameters are located in `app.config.json` file. The server also supports setting parameters using 
environment variables. By default the server loads settings from `app.config.json` file, and overwrites specific 
parameter if the corresponding environment variable found. 

- **storageProvider**\
Storage provider for persistence layer (see details in the [storage providers](#storage-providers) section)\
Default value: `"in-memory"`\
Env parameter: `STORAGE_PROVIDER`
- **storageConnectionString**\
Connection string for storage provider\
Default value: `""`\
Env parameter: `STORAGE_CONNECTION_STRING`
- **apiPort**\
HTTP API port exposed by the server\
Default value: `1237`\
Env parameter: `API_PORT`
- **corsWhitelist**\
List of allowed origins\
Default value: `[]`\
Env parameter: `CORS_WHITELIST` (separate origins with commas)
- **authenticator.APIType**\
Authenticator service API type\
Possible values `1`- REST and `2`- GraphQL (not implemented yet)\
Default value: `1`\
Env parameter: `AUTHENTICATOR_API_TYPE`
- **authenticator.URL**\
Authenticator service endpoint\
Default value: `""`\
Env parameter: `AUTHENTICATOR_URL`

## Storage providers

By default the keystore uses ephemeral in-memory storage provider. This provider is not intended for production use. 
Please install one of the available storage providers or create your own.

### List of available storage providers

- [MongoDb provider](https://github.com/orbitlens/stellar-wallet-keystore-mongodb-provider)
- [PostgreSQL provider](https://github.com/orbitlens/stellar-wallet-keystore-postgresql-provider)

### Storage provider installation

```
cd stellar-keystore-js
npm i stellar-keystore-js-<storage-provider-name>
```

### Config example (mongodb provider)

```
{
    "apiPort": 1237,
    "storageProvider": "mongodb",
    "storageConnectionString": "mongodb://localhost:27017/keystore"
}
```
