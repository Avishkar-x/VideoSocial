import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { stat } from "fs"

const getChannelStats = asyncHandler(async (req, res) => {
    const result = await Video.aggregate([
        {
            $match: {
                owner: req.user._id
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"likes"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "video",
                as: "comments"
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { 
                    $sum: 1 
                },
                totalViews: { 
                    $sum: "$views" 
                },
                totalLikes:{
                    $sum:{
                        $size:"$likes"
                    }
                },
                publishedVideos:{
                    $sum:{
                        $cond:["$isPublished", 1, 0]
                    }
                },
                unpublishedVideos:{
                    $sum:{
                        $cond:["$isPublished", 0, 1]
                    }
                },
                totalComments:{
                    $sum:{
                        $size:"$comments"
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                totalVideos:1,
                totalViews:1,
                totalLikes:1,
                publishedVideos:1,
                unpublishedVideos:1,
                totalComments:1,
                averageViews: {
                    $cond: [
                        { $eq: ["$totalVideos", 0] },
                        0,
                        {
                            $divide: ["$totalViews", "$totalVideos"]
                        }
                    ]
                }
            }
        }
    ])

    const stats = result[0] || {
        totalVideos: 0,
        publishedVideos: 0,
        unpublishedVideos: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        averageViews: 0
    }

    
    const totalSubscribers = await Subscription.countDocuments({
        channel: req.user._id
    })
    
    stats.totalSubscribers = totalSubscribers

    return res
    .status(200)
    .json(
        new ApiResponse(200,stats, "Stats fetched successfully")
    )
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video.aggregate([
        {
            $match:{
                owner:req.user._id
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $project:{
                owner:0,
                __v:0,
                description:0
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200,videos,"Videos for dashboard fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }