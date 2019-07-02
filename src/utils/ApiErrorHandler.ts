import { Request, Response } from 'express'

const statuses: { [status: string]: string } = {
    "200": "OK",
    "400": "Bad Request",
    "401": "Unauthorized",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "409": "Conflict",
    "500": "Internal Server Error",
    "501": "Not Implemented"
}

export class HttpError extends Error {
    constructor(message: string, statusCode?: number) {
        super(message)
        this.statusCode = statusCode || 500
    }
    statusCode: number
}

export default function () {
    return function apiErrorHandler(err: Error | HttpError, req: Request, res: Response) {
        let error: HttpError = <HttpError>err
        let status = error.statusCode || 500
        if (status < 400)
            status = 500
        res.statusCode = status

        const body = {
            status,
            message: ''
        }

        // internal server errors
        if (status >= 500) {
            console.error(error)
            body.message = statuses[status.toString()] || statuses["500"]
            res.json(body)
            return
        }

        // client errors
        body.message = err.message || statuses[status] || 'Error occured'

        res.json(body)
    }
}