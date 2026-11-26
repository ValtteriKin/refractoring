import express, { response } from 'express'
import {doLogin, refreshAccessToken} from '../services/auth.js'


const router = express.Router()

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    path: '/auth'
}

router.post('/', async (req, res) => {
    const {username, password} = req.body

    if(!username || !password){
        return res.status(400).json({error: 'Username and password are required'})
    }

    const result = await doLogin(username, password)

    if (!result) {
        return res.status(401).json({error: 'Invalid credential'})
    }
    
    const {refresh_token, ...response} = result
    return res
        .cookie('refresh_token', refresh_token, cookieOptions)
        .status(200)
        .json(response)
})

router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies?.refresh_token

    if(!refreshToken) {
        return res.status(401).json({
            error: 'Refresh token is missing'
        })
    }

    const result = await refreshAccessToken(refreshToken)

    if (!result) {
        return res.status(401).json({
            error: 'invalid on expired refresh token'
        })
    }

    return res.status(200).json(result)
})

router.post('/logout', (req, res) => {
    res.clearCookie('refresh_token', cookieOptions)
    return res.status(200).json({
        message: 'Logged out successfully'
    })
})
export default router