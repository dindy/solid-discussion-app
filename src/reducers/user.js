import * as utils from './utilities'

const initialState = {
    authenticated: false,
    id: null,
    error: null,
    storages: [],
    privateTypeIndexUrl: null,
    loading: false,
    discussionOwnership: [],
}

const merge = (state, action) => ({
    ...state, 
    storages: action.payload.storages || state.storages,
    privateTypeIndexUrl: action.payload.privateTypeIndexUrl || state.privateTypeIndexUrl,
})

const authenticationLaunch = (state, action) => ({ ...state, 
    error: null,
    loading: true,
})

const authenticationSuccess = (state, action) => ({ ...state, 
    loading: false,
    authenticated: true,
    id: action.payload.webId,
})

const authenticationError = (state, action) => ({ ...state, 
    loading: false,
    authenticated: false, 
    error: action.payload, 
})

const requestProfileLaunch = (state, action) => ({ ...state, 
    loading: true,
    error: null,
})
    
const requestProfileSuccess = (state, action) => ({ 
    ...merge(state, action), 
    loading: false 
}) 
    
const requestProfileError = (state, action) => ({ ...state, 
    error: action.payload, 
    loading: false, 
})

const addDiscussionOwnership = (state, action) => ({ ...state, 
    discussionOwnership: [
        ...state.discussionOwnership,
        action.payload
    ] 
})

const user = utils.createReducer(initialState, {
    'AUTHENTICATION_LAUNCH': authenticationLaunch,
    'AUTHENTICATION_SUCCESS': authenticationSuccess,
    'AUTHENTICATION_ERROR': authenticationError,
    'USER_PROFILE_LOADING': requestProfileLaunch,
    'USER_PROFILE_LOAD_SUCCESS': requestProfileSuccess,
    'USER_PROFILE_LOAD_ERROR': requestProfileError,
    'USER_ADD_DISCUSSION_OWNERSHIP': addDiscussionOwnership,
})  

export default user        