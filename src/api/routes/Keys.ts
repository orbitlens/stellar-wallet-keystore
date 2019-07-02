import userProvider from '../../logic/KeysManager'
import asyncHandler from '../../utils/ApiHandlerWrapper'

import userMiddleware from '../../middlewares/AuthMiddleware'
import { Router } from 'express'
import PutKeysRequest from '../../models/PutKeysRequest'

function userRoutes(router: Router) {
    router.route('/keys')
        .all(userMiddleware)
        // .post(asyncHandler(async function (req, res, next) {
        //     const requestData = <PutKeysRequest>req.body

        //     const keyData = await userProvider.putKeys(requestData, req.userId)
        //     return res.json(keyData)
        // }))
        .put(asyncHandler(async function (req, res, next) {

            const requestData = <PutKeysRequest>req.body

            const keyData = await userProvider.putKeys(requestData, req.userId)
            return res.json(keyData)
        }))
        .get(asyncHandler(async function (req, res, next) {
            const keyData = await userProvider.getKeyData(req.userId)
            return res.json(keyData)
        }))
        .delete(asyncHandler(async function (req, res, next) {
            await userProvider.removeKeyData(req.userId)
            return res.json({ message: "ok" })
        }))
}

export default userRoutes