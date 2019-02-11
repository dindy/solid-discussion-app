import config from '../config.js'
import { loadAndParseProfile } from '../api/api.js'

const auth = window.solid.auth

async function popupLogin() {
    let session = await auth.currentSession()
    return !session ? 
        await auth.popupLogin({ popupUri: config.popupUri }) : 
        session
}

export const recoverSession = () => (dispatch) => {
    return auth.currentSession().then( session => {
        if (!!session) dispatch(login())
    })
} 

export const login = () => dispatch => {
    dispatch({ type: 'AUTHENTICATION_LAUNCH', payload: null })
    // Get the session
    popupLogin().then(
        session => {
            dispatch({ type: 'AUTHENTICATION_SUCCESS', payload: session })
            dispatch({ type: 'USER_PROFILE_LOADING', payload: null })     
            // Request the profile
            loadAndParseProfile(session.webId).then(
                (parsed) => {
                    dispatch({ type: 'USER_PROFILE_LOAD_SUCCESS', payload: parsed })
                    dispatch({ type: 'PERSON_PARSED', payload: parsed })
                }, 
                (error) => dispatch({ type: 'USER_PROFILE_LOAD_ERROR', payload: error.message })
            )
        },
        error => dispatch({ type: 'AUTHENTICATION_ERROR', payload: error })
    )    
}