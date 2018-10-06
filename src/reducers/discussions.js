import slug from 'slug'

const initialState = {
    error: null,
    newDiscussion: {
        path: null,
        name: null,
        nameError: null,
        storageUrl: null,
        folderName: null,
        addToPrivateIndex: true,
        isValid: false,
    }
}

const validateNewDiscussion = (newDiscussionState) => {
    if (newDiscussionState.name == '' || newDiscussionState.name == null) {
        newDiscussionState.nameError = 'This field is mlandatory.'
        newDiscussionState.isValid = false
        return newDiscussionState
    }
    newDiscussionState.isValid = true
    return newDiscussionState
}

const discussions = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_DISCUSSION_LAUNCH':
            return {
                ...state,  
            }   
        case 'SET_NEW_DISCUSSION_STORAGE_URL':
            return {
                ...state,
                newDiscussion: {
                    ...state.newDiscussion,
                    storageUrl: action.payload
                }  
            }   
        case 'SET_NEW_DISCUSSION_ADD_PRIVATE_INDEX':
            return {
                ...state,
                newDiscussion: {
                    ...state.newDiscussion,
                    addToPrivateIndex: action.payload
                }  
            }   
        case 'SET_NEW_DISCUSSION_PATH':
            return {
                ...state,
                newDiscussion: {
                    ...state.newDiscussion,
                    path: action.payload
                }  
            }   
        case 'SET_NEW_DISCUSSION_NAME':
            return {
                ...state,
                newDiscussion: {
                    ...state.newDiscussion,
                    name: action.payload,
                    nameError: null,
                    folderName: action.payload != '' ? slug(action.payload).toLowerCase() : null
                }  
            }   
        case 'EXPLORER_SELECT_FOLDER':
            return {
                ...state,
                newDiscussion: {
                    ...state.newDiscussion,
                    path: action.payload,
                }  
            }   
        case 'NEW_DISCUSSION_VALIDATE':
            return {
                ...state,
                newDiscussion: validateNewDiscussion(state.newDiscussion)
            }   

        case 'NEW_DISCUSSION_CREATE':
            return {
                ...state,
            }
        default:
            return state
    }
}
  
export default discussions                