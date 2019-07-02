import {Request, Response, NextFunction, RequestHandler} from 'express'

const asyncHandler = (handler: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise
        .resolve(handler(req, res, next))
        .catch(next)
}

export default asyncHandler