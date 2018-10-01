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
    // Get the session
    popupLogin().then(
        session => {
            dispatch({ type: 'AUTHENTICATION_SUCCESS', payload: session })
            dispatch({ type: 'REQUEST_PROFILE_LAUCH', payload: null })
            // Request the profile
            loadProfile(session.webId)
                .then(
                    response => {
                        // If http status != 200, it's actually an error. 
                        // Body should contain an error message
                        if (response.status != '200') 
                            return response.text().then(message => Promise.reject(new Error(message)))
                        // Else it's ok parse the text
                        else return response.text()
                    },
                    error => dispatch({ type: 'REQUEST_PROFILE_ERROR', payload: error.message })
                )
                .then( 
                    profile => dispatch({ type: 'REQUEST_PROFILE_SUCCESS', payload: profile }),
                    error => dispatch({ type: 'REQUEST_PROFILE_ERROR', payload: error.message })
                )
        },
        error => dispatch({ type: 'AUTHENTICATION_ERROR', payload: error })
    )    
}