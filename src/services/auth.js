import jwt from 'jsonwebtoken'
import { getAuthUser } from './users.js'
import {v4 as uuidv4} from 'uuid'
import { saveRefreshSession, getRefreshSession, revokeRefreshSession, isRefreshTokenValid } from './refresh-sessions.js'

const ACCESS_TOKEN_EXPIRES = '15m'
const REFRESH_TOKEN_EXPIRES = '7d'

const generateAccessToken = (username) => {
    return jwt.sign(
        { sub: username, type: 'access'},
            process.env.JWT_ACCESS_SECRET, {
                expiresIn: ACCESS_TOKEN_EXPIRES
            })
}

const generateRefreshToken = (username) => {
    return jwt.sign(
        { sub: username, type: 'refresh', jti: uuidv4()},
            process.env.JWT_REFRESH_SECRET, {
                expiresIn: REFRESH_TOKEN_EXPIRES
            })
}

export async function doLogin(username, password){
    const user = await getAuthUser(username)

    if (!user ||  user.password !== password){
        return null
    }
    const access_token = generateAccessToken(username)
    const refresh_token = generateRefreshToken(username)

    const ref_ses = jwt.decode(refresh_token)
    saveRefreshSession({
        jti: ref_ses.jti,
        username : username,
        expiresIn: ref_ses.exp * 1000,
        revoked: false
    })
        
        return({
            "user": username, 
            "access_token": access_token, 
            "refresh_token": refresh_token , 
            "token_type": "Bearer", 
            "expires_in": 900
        })
}

export const refreshAccessToken = async  (refresh_token) =>{
    try{
        const payload = jwt.verify(
            refresh_token, 
            process.env.JWT_REFRESH_SECRET
        )
        
        if(payload.type !== 'refresh'){
            return null
        }

        const user = await getAuthUser(payload.sub)
        if(!user){
            return null
        }

        if(!isRefreshTokenValid(payload.jti)){
            return null
        }

        revokeRefreshSession(payload.jti)
        const new_refresh_token = generateRefreshToken(payload.sub)
        const new_refresh = jwt.decode(new_refresh_token)

        const access_token = generateAccessToken(new_refresh.sub)
        saveRefreshSession({        
            jti: new_refresh.jti,
            username : new_refresh.sub,
            expiresAt: new_refresh.exp * 1000,
            revoked: false})
        return {
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": 900,
            "refresh_token": new_refresh_token
        }
    }catch(err){
        return null
    }
}