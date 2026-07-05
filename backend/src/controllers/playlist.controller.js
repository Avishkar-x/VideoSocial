import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name?.trim() || !description?.trim())
        throw new ApiError(400, "name and description both are required")

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        owner: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, playlist, "Playlist created successfully")
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!isValidObjectId(userId))
        throw new ApiError(400, "Invalid user id")

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                thumbnail: {
                    $ifNull: [
                        { $first: "$videos.thumbnail" },
                        null
                    ]
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                totalVideos: 1,
                thumbnail: 1,
                createdAt: 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "Playlists fetched successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!isValidObjectId(playlistId))
        throw new ApiError(400, "Invalid playlist id")


    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    const isOwner = playlist.owner.equals(req.user._id);

    await playlist.populate({
        path: "videos",
        match: isOwner ? {} : { isPublished: true },
        select: "-description -isPublished",
        populate: {
            path: "owner",
            select: "username fullName avatar"
        }
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "playlist fetched successfully")
        )

    // Since playlist doesnt have public or pvt status we assume its public by default.
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
        throw new ApiError(400, "Invalid playlist or video id")

    const playlist = await Playlist.findById(playlistId)

    if (!playlist)
        throw new ApiError(404, "playlist not found")

    if (!req.user._id.equals(playlist.owner))
        throw new ApiError(403, "Only user can update playlist")

    const video = await Video.findById(videoId)

    if (!video)
        throw new ApiError(404, "Video not found")

    if (!video.isPublished && !req.user._id.equals(video.owner))
        throw new ApiError(403, "Unpublished videos can only be added by video owner")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video added in playlist successfully")
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
        throw new ApiError(400, "Invalid playlist or video id")

    const playlist = await Playlist.findById(playlistId)

    if (!playlist)
        throw new ApiError(404, "playlist not found")

    if (!req.user._id.equals(playlist.owner))
        throw new ApiError(403, "Only user can update playlist")

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video removed successfully")
        )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!isValidObjectId(playlistId))
        throw new ApiError(400, "Invalid playlist id")

    const playlist = await Playlist.findById(playlistId)

    if (!playlist)
        throw new ApiError(404, "playlist not found")

    if (!req.user._id.equals(playlist.owner))
        throw new ApiError(403, "Only user can delete playlist")

    await playlist.deleteOne()

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    if (!isValidObjectId(playlistId))
        throw new ApiError(400, "Invalid playlist id")

    if (!name?.trim() || !description?.trim())
        throw new ApiError(400, "Name or description is required to update")

    const playlist = await Playlist.findById(playlistId)

    if (!playlist)
        throw new ApiError(404, "playlist not found")

    if (!req.user._id.equals(playlist.owner))
        throw new ApiError(403, "Only user can update playlist")

    playlist.name = name.trim()
    playlist.description = description.trim()

    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist updated successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
