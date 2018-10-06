export const newDiscussion = () => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_LAUNCH', payload: null })    
}

// export const changeNewChatPath = (path) => (dispatch) => {
//     const folders = path.split('/')
//     const invalidPatern = /[<>:"\/\\|?*\x00-\x1F]|^(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9])$/i;
//     folders.forEach(folder => {
//         if (invalidPatern.test(folder))
//             dispatch({ type: 'NEW_DISCUSSION_INVALID_PATH', payload: folder })    
//     })
// }

export const changeNewDiscussionStorage = storageUrl => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_STORAGE_URL', payload: storageUrl })    
}

export const changeNewDiscussionName = name => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_NAME', payload: name })    
}

export const changeNewDiscussionPath = path => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_PATH', payload: path })    
}

export const changeNewDiscussionAddPrivateIndex = added => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_ADD_PRIVATE_INDEX', payload: added })    
}

export const cancelNewDiscussion = added => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_CANCEL', payload: added })    
}


export const createNewDiscussion = () => (dispatch, getStore) => {
    dispatch({ type: 'NEW_DISCUSSION_VALIDATE', payload: null })
    const store = getStore()
    if (store.discussions.newDiscussion.isValid)       
        dispatch({ type: 'NEW_DISCUSSION_CREATE', payload: null })
}