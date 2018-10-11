import * as utils from './utilities'

const initialState = {
    authenticated: false,
    id: null,
    error: null,
    storages: [],
    privateTypeIndexUrl: null,
}

const merge = (state, action) => ({
    ...state, 
    storages: action.payload.storages || state.storages,
    privateTypeIndexUrl: action.payload.privateTypeIndexUrl || state.privateTypeIndexUrl,
})

const authenticationLaunch = (state, action) => ({ ...state, error: null })

const authenticationSuccess = (state, action) => ({ ...state, 
    authenticated: true,
    id: action.payload.webId  
})

const authenticationError = (state, action) => ({ ...state, authenticated: false, error: action.payload })

const requestProfileLaunch = (state, action) => ({ ...state, error: null })

const requestProfileSuccess = (state, action) => merge(state, action)

const requestProfileError = (state, action) => ({ ...state, error: action.payload })

const user = utils.createReducer(initialState, {
    'AUTHENTICATION_LAUNCH': authenticationLaunch,
    'AUTHENTICATION_SUCCESS': authenticationSuccess,
    'AUTHENTICATION_ERROR': authenticationError,
    'REQUEST_PROFILE_LAUNCH': requestProfileLaunch,
    'REQUEST_PROFILE_SUCCESS': requestProfileSuccess,
    'REQUEST_PROFILE_ERROR': requestProfileError,
})  

export default user        