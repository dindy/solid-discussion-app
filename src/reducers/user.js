import * as utils from './utilities'

const initialState = {
    authenticated: false,
    webId: null,
    name: null,
    avatarUrl: null,
    error: null,
    storages: [],
    privateTypeIndexUrl: null,
}

const authenticationSuccess = (state, action) => ({ ...state, 
    authenticated: true,
    webId: action.payload.webId  
})

const authenticationError = (state, action) => ({ ...state, authenticated: false })

const requestProfileError = (state, action) => ({ ...state, error: action.payload })

const setProfileName = (state, action) => ({ ...state, name: action.payload })

const setProfilePrivateTypeIndex = (state, action) => ({ ...state, privateTypeIndexUrl: action.payload })

const setProfileAvatarUrl = (state, action) => ({ ...state, avatarUrl: action.payload })

const addProfileStorage = (state, action) => ({ ...state, 
    storages: (state.storages.includes(action.payload)) ? 
        state.storages : [...state.storages, action.payload] 
})

const user = utils.createReducer(initialState, {
    'AUTHENTICATION_SUCCESS': authenticationSuccess,
    'AUTHENTICATION_ERROR': authenticationError,
    'REQUEST_PROFILE_ERROR': requestProfileError,
    'SET_PROFILE_NAME': setProfileName,
    'SET_PROFILE_PRIVATE_TYPE_INDEX': setProfilePrivateTypeIndex,
    'SET_PROFILE_AVATAR_URL': setProfileAvatarUrl,
    'ADD_PROFILE_STORAGE': addProfileStorage,
})  

export default user        