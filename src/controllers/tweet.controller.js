import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body

    if(!content.trim()) 
        throw new ApiError(400,"Tweet content missing")

    const tweet = await Tweet.create({
        content:content.trim(),
        owner:req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,tweet,"Tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!mongoose.Types.ObjectId.isValid(userId))
        throw new ApiError(400,"Invalid user id")

    const tweets = await Tweet.find({
        owner: userId
    }).sort({ createdAt: -1 })

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweets,"User tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const {tweetId} = req.params
    if(!content?.trim())
        throw new ApiError(400,"Content required to update tweet")

    if(!mongoose.Types.ObjectId.isValid(tweetId))
        throw new ApiError(400,"Invalid tweet id")

    const tweet = await Tweet.findById(tweetId)
    if(!tweet) 
        throw new ApiError(404, "Tweet was not found")

    if(!req.user._id.equals(tweet.owner))
        throw new ApiError(403,"Only owners can update tweet")

    if(tweet.content === content.trim())
        throw new ApiError(403,"Tweet content is unchanged")

    tweet.content = content.trim()

    await tweet.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweet,"Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!mongoose.Types.ObjectId.isValid(tweetId))
        throw new ApiError(400,"Invalid tweet id")

    const tweet = await Tweet.findById(tweetId)
    if(!tweet) 
        throw new ApiError(404, "Tweet was not found")

    if(!req.user._id.equals(tweet.owner))
        throw new ApiError(403,"Only owners can delete tweet")

    await Like.deleteMany({
        tweet: tweet._id
    })
    await tweet.deleteOne()

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
