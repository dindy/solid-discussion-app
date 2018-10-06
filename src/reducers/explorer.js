const initialState = {
    root: null,
    storage: null,
    folders: [],
    fetching: false,
    error: null,
    selected: null,
}

const getFolderName = (url) => {
    const parts = url.split('/')
    return parts[parts.length - 2]
} 

const getRootParentId = (folders, root) => {
    return folders
        .filter(folder => folder.id == root)
        .map(folder => folder.parent)
        [0]  
}

const addFolder = (folders, root, newFolderId) => {
    
    const alreadyExisting = folders.filter(folder => folder.id == newFolderId)
    
    if (!alreadyExisting.length > 0) return [
        ...folders, 
        { 
            id: newFolderId, 
            name: getFolderName(newFolderId),
            parent: root 
        }
    ]      
    return folders
}

const explorer = (state = initialState, action) => {
    switch (action.type) {
        case 'EXPLORER_OPEN':
            return {
                ...state,
                storage: action.payload
            }   
        case 'SET_EXPLORER_ROOT':
            return {
                ...state,
                root: action.payload,
            }   
        case 'CLEAR_EXPLORER_FOLDERS':
            return {
                ...state,
                folders: []  
            }   
        case 'EXPLORER_OPEN_PARENT':
            return {
                ...state,
                root: getRootParentId(state.folders, state.root) 
            }
        case 'ADD_EXPLORER_FOLDER':
            return {
                ...state,
                folders: addFolder(state.folders, state.root, action.payload)
            }   
        default:
            return state
    }
}
  
export default explorer