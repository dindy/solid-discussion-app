import auth from 'solid-auth-client'
import config from '../config.js'

async function popupLogin() {
    let session = await auth.currentSession()
    return !session ? 
        await auth.popupLogin({ popupUri: config.popupUri }) : 
        session
}

async function loadProfile(webId) {
    return await auth.fetch(webId)
}

export const recoverSession = () => dispatch => {
    auth.currentSession().then( session => {
        if (!!session) dispatch(login())
    })
} 

export const login = () => dispatch => {
    dispatch({ type: 'AUTHENTICATION_LAUNCH', payload: null })
    popupLogin().then(
        session => {
            dispatch({ type: 'AUTHENTICATION_SUCCESS', payload: session })
            dispatch({ type: 'REQUEST_PROFILE_LAUCH', payload: null })
            loadProfile(session.webId)
                .then(
                    profile => profile.text(),
                    error => dispatch({ type: 'REQUEST_PROFILE_ERROR', payload: error })
                )
                .then( profile => {  
                    dispatch({ type: 'REQUEST_PROFILE_SUCCESS', payload: profile })
                })
        },
        error => {
            dispatch({ type: 'AUTHENTICATION_ERROR', payload: error })
        }
    )    
}