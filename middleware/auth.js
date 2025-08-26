import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken || req?.header?.authorization?.split(" ")[1]   //Bearer token

        if(!token){
            return res.status(401).send({
                status: false,
                message: "No token provided",
                error: true,
                success: false
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN)

     if(!decode){
        return res.status(401).send({
            status: false, 
            message: "Unauthorized access",
            success: false,
            error: true
        })
     }

        req.userId = decode.id
        next()
        
    } catch (error) {
        res.status(500).send({
            status: false,
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export default auth