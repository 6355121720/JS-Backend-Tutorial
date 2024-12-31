import {ApiError} from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'

export const verifyJWT = async (req, res, next) => {
    try{
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        console.log(accessToken)
        if (!accessToken){
            throw new ApiError(401, "Unauthorized request.")
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        console.log(decodedToken)
        const user = await User.findById(decodedToken?._id).select("-refreshToken -password")
        console.log(user)
        if(!user){
            throw new ApiError(401, "Invalid accessToken")
        }
        
        req.user = user
        next()

    } catch(error){
        throw new ApiError(401, error?.message || "Invalid accessToken")
    }
}