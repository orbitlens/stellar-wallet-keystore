import createError from '../utils/ErrorHelper'
import asyncHandler from '../utils/ApiHandlerWrapper'
import { Request, Response, NextFunction } from 'express'
import config, { APIType } from '../Config'
import fetch, { HeadersInit } from 'node-fetch'

async function fetchUserId(headers: HeadersInit) {
    const response = await fetch(config.authenticator.URL, {
        method: 'GET',
        headers,
        timeout: 5000
    })

    const data = await response.json()
    return data.userID
}

function proxyHeader(req: Request) {
    let headers: { [key: string]: string } = {}
    Object.assign(headers, req.headers)
    delete headers['content-length']//otherwise get request will fail
    headers['X-Forwarded-For'] = <string>(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    return headers
}


async function authMiddleware(req: Request, res: Response, next: NextFunction) {

    let userId = ''
    if (process.env.NODE_ENV)
        userId = 'test-user'
    else
        switch (config.authenticator.APIType) {
            case APIType.REST:
                userId = await fetchUserId(proxyHeader(req))
                break
            case APIType.GraphQL:
            // to be implemented later
            default:
                throw createError(500, 'Authenticator is not configurated properly')
        }

    if (!userId)
        throw new Error('Unable to fetch user id')

    req.userId = userId
    next()
}

export default asyncHandler(authMiddleware)