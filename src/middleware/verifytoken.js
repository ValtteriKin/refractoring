import jwt from 'jsonwebtoken'
import { getAuthUser } from '../services/users.js'

export const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization')

    if(!authHeader || !authHeader.toLowerCase().startsWith('bearer ')){
        return res.status(401).json({error: 'Unauthorized'})
    }

    const token = authHeader.substring(7) //remove 'Bearer' prefix
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        if(decodedToken.type !== 'access' || !await getAuthUser(decodedToken.sub)){  //changed username to sub
            return res.status(401).json({error: 'Unauthorized'})
        }

        req.user = decodedToken.sub
        next()
    }catch(err){
        return res.status(401).json({error: 'Unauthorized'})
    }
}

