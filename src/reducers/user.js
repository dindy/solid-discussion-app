const initialState = {
    authenticated: false,
    webId: null,
    name: null,
    avatarUrl: null,
    error: null,
    storages: [],
    auth: null,
    privateTypeIndexUrl: null,
}

const addUniqueStorage = (storageUri, storagesState) => (storagesState.includes(storageUri)) ? 
        storagesState : [...storagesState, storageUri]

const user = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATION_SUCCESS':
        return {
            ...state, 
            authenticated: true,
            webId: action.payload.webId      
        }    
        case 'AUTHENTICATION_ERROR':    
            return {
                ...state, 
                authenticated: false,
            }    
        case 'REQUEST_PROFILE_ERROR':    
            return {
                ...state, 
                error: action.payload
            }    
        case 'REQUEST_PROFILE_SUCCESS':
            return {
                ...state,
            }           
        case 'SET_PROFILE_NAME':
            return {
                ...state,
                name: action.payload
            }           
        case 'SET_PROFILE_PRIVATE_TYPE_INDEX':
            return {
                ...state,
                privateTypeIndexUrl: action.payload
            }           
        case 'SET_PROFILE_AVATAR_URL':
            return {
                ...state,
                avatarUrl: action.payload
            }           
        case 'ADD_PROFILE_STORAGE':
            return {
                ...state,
                storages: addUniqueStorage(action.payload, state.storages)
            }           
        case 'STORE_AUTH_CLIENT':
            return {
                ...state,
                auth: action.payload
            }           
        default:
            return state
    }
}
  
export default user        