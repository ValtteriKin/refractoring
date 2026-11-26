const refreshSessions = []

export function saveRefreshSession(session){
    refreshSessions.push(session)
}

export function getRefreshSession(jti){  //jti = jwt id
    return refreshSessions.find( session => session.jti ===jti)
}

export function revokeRefreshSession(jti){
    const session = refreshSessions.find( session => session.jti ===jti)
    if(session !== undefined){
        session.revoked = true
    }
    else{
        return false
    }
}

export function isRefreshTokenValid(jti){
    const session = refreshSessions.find( session => session.jti ===jti)
    if(session !== undefined && session.revoked === false && session.expiresAt >= Date.now()){
        return true
    }else{
        return false
    }
}