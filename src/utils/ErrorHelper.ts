import { HttpError } from './ApiErrorHandler'

export default function createError(statusCode?: number, message?: string) {
    const error = new HttpError(message || '')
    error.statusCode = statusCode || 500
    return error
}