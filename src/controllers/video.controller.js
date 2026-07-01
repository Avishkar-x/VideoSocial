import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const { query, sortBy, sortType, userId } = req.query
    if(limit < 1 || page < 1)
    {
        throw new ApiError(400,"Invalid limit or page")
    }

    if(userId && !isValidObjectId(userId))
    {
        throw new ApiError(400,"Invalid userId")
    }

    const matchStage = {}
    
    if(userId)
    {
        // if userId is present in query
        matchStage.owner = new mongoose.Types.ObjectId(userId)
        if(req.user._id.toString() !== userId)
        {
            // only show published videos
            matchStage.isPublished = true
        }
            
    }else{
        // if !userID then show only published videos
        matchStage.isPublished = true
    }

    // if query is given
    // check for keywords in title or description
    if(query)
    {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }

    // sort before lookup in users, to reduce cost
    const aggregate = Video.aggregate([
        {
            $match: matchStage
        },
        {
            $sort:{
                [sortBy]: sortType === "asc"? 1 : -1
            }
        },
        {
            $lookup:{
                from: "users",
                localField:"owner",
                foreignField:"_id",
                as: "owner",
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first: "$owner"
                }
            }
        }
    ])

    const options={
        page,
        limit
    }

    const videos = await Video.aggregatePaginate(aggregate,options);

    return res
    .status(200)
    .json(
        new ApiResponse(200,videos, "Videos fetched successfully")
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title || !description)
    {
        throw new ApiError(400,"Both title and description is required")
    }

    const localVideoPath = req.files?.videoFile?.[0]?.path 
    const localThumbnailPath = req.files?.thumbnail?.[0]?.path

    if(!localVideoPath || !localThumbnailPath)
    {
        throw new ApiError(400,"Both video and thumbnail are required")
    }

    const videoUpload = await uploadOnCloudinary(localVideoPath)
    const thumbnailUpload = await uploadOnCloudinary(localThumbnailPath)

    if(!videoUpload?.url || !thumbnailUpload.url)
    {
        throw new ApiError(500, "Error while uploadind video or thumbnail")
    }
    let isPublished = true;

    if (req.body.isPublished !== undefined) {
        isPublished = req.body.isPublished === "true";
    }

    const video = await Video.create({
        videoFile:videoUpload?.url,
        thumbnail:thumbnailUpload?.url,
        title,
        description,
        duration:videoUpload.duration,
        isPublished,
        owner:req.user._id
    })

    return res 
    .status(201)
    .json(
        new ApiResponse(201,video,"Video uploaded successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid video id")
    }

    const videos = await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            } 
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                        {
                        $project:{
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]
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
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as:"comments"
            }
        },
        {
            $addFields:{
                owner:{
                    $first: "$owner"
                },
                likes:{
                    $size:"$likes"
                },
                comments:{
                    $size:"$comments"
                },
                isLiked:{
                    $in: [
                        req.user._id,
                        "$likes.likedBy"
                    ]
                }
            }
        }
    ]);
    const video = videos[0]
    if(!video) throw new ApiError(404, "Video not found")

    if(!video.isPublished &&( !req.user || video.owner._id.toString() !== req.user?._id.toString()))
    {
        throw new ApiError(403, "Video is not published")
    }

    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    });

    video.views += 1; // keep response in sync

    if(req.user?._id)
    {
        // remove the video if already watched
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                watchHistory: video._id
            }
        })
        // and push it at beginning (recent)
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                watchHistory: {
                    $each: [video._id],
                    $position: 0
                }
            }
        });
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId))
    {
        throw new ApiError(400,"Invalid video id")
    }

    const {title,description} = req.body
    const localThumbnailPath = req.file?.thumbnail?.[0]?.path
    if(!title && !description && !localThumbnailPath)
    {
        throw new ApiError(400,"update fields missing")
    }

    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(404,"Video not found")

    if(!req.user._id.equals(video.owner))
    {
        throw new ApiError(403, "Video details can only be updated by owner")
    }
    let thumbnail
    if(localThumbnailPath)
    {
        thumbnail = await uploadOnCloudinary(localThumbnailPath)
        if(!thumbnail?.url)
        {
            throw new ApiError(500,"Thumbnail uploading failed")
        }
        video.thumbnail = thumbnail.url
    }
    if(title) video.title = title
    if(description) video.description = description

    await video.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId))
    {
        throw new ApiError(400,"Invalid video id")
    }
    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(404,"Video not found")

    if(!req.user._id.equals(video.owner))
    {
        throw new ApiError(403, "Video can only be deleted by owner")
    }
    await Like.deleteMany({
        video: videoId
    });
    await Comment.deleteMany({
        video: videoId
    });
    await video.deleteOne();

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId))
    {
        throw new ApiError(400,"Invalid video id")
    }
    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(404,"Video not found")

    if(!req.user._id.equals(video.owner))
    {
        throw new ApiError(403, "Publish status can only be changed by owner")
    }
    video.isPublished = !video.isPublished;

    await video.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            `Video ${video.isPublished ? "published" : "unpublished"} successfully`
        )
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
