import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { decode } from 'punycode'


const generateAccessAndRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId)
        console.log("first", user)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        console.log("second",accessToken,refreshToken)

        user.refreshToken = refreshToken
        // await user.save({validateBeforeSave: false})
        await user.save()

        return {accessToken, refreshToken}

    } catch(error){
        throw new ApiError(500, "something went wrong while generating access and refresh token")
    }
}


const registerUser = async (req, res) => {
    // console.log(req.files,'lfsa')
    // console.log(req.body,'gdfkl')
    // console.log('written all things')
    const {username, email, fullName, password} = req.body
    if ([username, email, fullName, password].some((field) => !field?.trim())){
        throw new ApiError(400, "All Fields are required.")
    }
    const existedUser = await User.findOne({
        '$or':[{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with username or email already exists.")
    }
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar file is required.")
    }

    console.log(avatarLocalPath,coverImageLocalPath)

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log(avatar,"viral",coverImage,"mitul")

    fs.unlinkSync(avatarLocalPath)
    fs.unlinkSync(coverImageLocalPath)

    if (!avatar?.url){
        throw new ApiError(309, "Avatar file can't be uploaded on cloudinary.")
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created Successfully!")
    )

}


const loginUser = async (req, res) => {
    const {username, email, password} = req.body
    if (!username && !email){
        throw new ApiError(400, "username or email is required.")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user){
        throw new ApiError(404, "user doesn't exists")
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if (!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggendInUser = await User.findById(user._id).select("-refreshToken -password")

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("viral1111",accessToken,"mitul2222",refreshToken)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{user:loggendInUser, accessToken, refreshToken}, "User loggen id Successfully")
    )
}

const logoutUser = async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
}

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken
    console.log("first", refreshToken)
    if (!refreshToken){
        throw new ApiError(401, "unauthorized request.")
    }

    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    if (!decodedToken){
        throw new ApiError(401, "unauthorized request.")
    }

    console.log("first", decodedToken._id)
    const user = await User.findById(decodedToken._id)

    console.log("second", user.username, user.refreshToken)

    if (!user){
        throw new ApiError(401, "invalid refresh token.")
    }

    console.log("jaimin ", refreshToken)

    console.log("deep", user.refreshToken)
    if (refreshToken !== user.refreshToken){
        throw new ApiError(401, "refresh token is expired or used.")
    }

    const {newrefreshToken, accessToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newrefreshToken, options)
    .json(
        new ApiResponse(200, {accessToken, refreshToken: newrefreshToken}, "Access token and refresh token generated successfully")
    )

}

const changeCurrentPassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    
    const user = User.findById(req.user._id)

    if(!user.isPasswordCorrect(oldPassword)){
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "password changed successfully")
    )
}

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "fetched current user successfully")
    )
}

const updateAccountDetails = async (req, res) => {
    const {fullName, email} = req.body
    
    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                fullName,
                email
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "account details updated successfully")
    )
}

const updateUserAvatar = async (req, res) => {
    const avatarLocalPath = req.files?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar) { 
        throw new ApiError(400, "avatar file upload on cloudinary failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar file uploaded on cloudinary.")
    )
}

const updateUserCoverImage = async (req, res) => {
    const coverImageLocalPath = req.files?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, "coverImage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage) { 
        throw new ApiError(400, "coverImage file upload on cloudinary failed")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "coverImage file uploaded on cloudinary.")
    )
}

const getUserChannelProfile = async (req, res) => {
    const {username} = req.params

    if (!username?.trim()){
        throw new ApiError(400, "username is not provided")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username : username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount: {
                    $size: "$subscriber"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                username: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404, "channel doesn't exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User Channel data fetched successfully.")
    )
}

const getWatchHistory = async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id : new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline:[
                    {   
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField:  "_id",
                            as: "owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName: 1, 
                                        email: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, user[0].watchHistory, "watchHistory fetched successfully")
    )

}


export {registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, getUserChannelProfile, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getWatchHistory}