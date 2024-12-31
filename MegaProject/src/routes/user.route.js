import {Router} from 'express'
import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, getUserChannelProfile, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getWatchHistory } from '../controllers/user.controller.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import path from 'path'
import { fileURLToPath } from "url";
import upload from '../middlewares/multer.middleware.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const userRouter = Router()

userRouter.route('/register').post(upload.fields([
    {
        "name":"avatar"
    },
    {
        "name":"coverImage"
    }
]), registerUser)

userRouter.route('/login').post(upload.none(), loginUser)

userRouter.route('/logout').post(verifyJWT, logoutUser)

userRouter.route('/refresh-access-token').post(refreshAccessToken)

userRouter.route('/change-password').post(verifyJWT, changeCurrentPassword)

userRouter.route('/current-user').get(verifyJWT, getCurrentUser)

userRouter.route('/update-account').patch(verifyJWT, updateAccountDetails)

userRouter.route('/update-avatar').patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

userRouter.route('/update-coverimage').patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

userRouter.route('/channel/:username').get(verifyJWT, getUserChannelProfile)

userRouter.route('/history').get(verifyJWT, getWatchHistory)

export default userRouter