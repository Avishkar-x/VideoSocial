import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import path from "path"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // Resolve to absolute path so it works regardless of CWD
        const absolutePath = path.resolve(localFilePath)
        console.log("Uploading file:", absolutePath, "exists:", fs.existsSync(absolutePath))
        const response = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(absolutePath)
        return response;

    } catch (error) {
        console.log("cloudinary error: " ,error);
        // Guard: only unlink if the file actually exists, to avoid a second error
        try {
            const absolutePath = path.resolve(localFilePath)
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath)
            }
        } catch (_) {}
        return null;
    }
}



export {uploadOnCloudinary}