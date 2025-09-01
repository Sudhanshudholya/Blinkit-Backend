import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"

//UPLOAD IMAGE CONTROLLER

const uploadImageController = async(req, res) => {
    try {
        const  file = req.file

        console.log("FILE", file)
 
        const uploadImage = await uploadImageCloudinary(file)

        return res.status(200).send({
            status: true,
            message: "Upload done successfully",
            data: uploadImage,
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default uploadImageController