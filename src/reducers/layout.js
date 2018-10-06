const initialState = {
    leftDrawer: {
        open: false
    },
    snackbar: {
        queue: [],
        open: false,
        messageInfo: {}
    },
    newDiscussionForm: {
        open: false
    },
    explorer: {
        open: false
    }
}

const addSnackbarMessage = (message, snackbarState) => {
    let newSnackbarState = {
        ...snackbarState,
        queue: [
            ...snackbarState.queue,
            { message, key: new Date().getTime() }  
        ]
    }
    
    if (newSnackbarState.open) {
        // immediately begin dismissing current message to start showing new one
        return { 
            ...newSnackbarState,
            open: false
        } 
    } else {
        return processSnackbarQueue(newSnackbarState);
    }
}

const processSnackbarQueue = snackbarState => {
    if (snackbarState.queue.length > 0) {
        return {
            ...snackbarState,
            messageInfo: snackbarState.queue[0],
            open: true,
            queue: [...snackbarState.queue.slice(0, snackbarState.queue.length - 1)] 
        }
    }

    return snackbarState
}

const handleSnackbarClose = (reason, snackbarState) => {
    if (reason === 'clickaway') 
        return snackbarState 

    return {
        ...snackbarState,
        open: false
    }    
}

const layout = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_DISCUSSION_LAUNCH':
            return {
                ...state,  
                newDiscussionForm: {
                    ...state.newDiscussionForm,
                    open: true
                }
            }           
        case 'NEW_DISCUSSION_CANCEL':
            return {
                ...state,  
                newDiscussionForm: {
                    ...state.newDiscussionForm,
                    open: false
                }
            }           
        case 'TOGGLE_LEFT_DRAWER':
            return {
                ...state, leftDrawer: {
                    ...state.leftDrawer,
                    open: !state.leftDrawer.open
                }      
            }    
        case 'CLOSE_LEFT_DRAWER':
            return {
                ...state, leftDrawer: {
                    ...state.leftDrawer,
                    open: false
                }      
            }    
        case 'OPEN_LEFT_DRAWER':
            return {
                ...state, leftDrawer: {
                    ...state.leftDrawer,
                    open: true
                }      
            }    
        case 'SNACKBAR_CLOSE': 
            return {
                ...state, 
                snackbar: handleSnackbarClose(action.payload, state.snackbar)
            }               
        case 'SNACKBAR_EXITED': 
            return {
                ...state, 
                snackbar: processSnackbarQueue(state.snackbar)
            }               
        case 'PARSE_PROFILE_ERROR':                    
        case 'REQUEST_PROFILE_ERROR':    
            return {
                ...state, 
                snackbar: addSnackbarMessage(action.payload, state.snackbar)
            }      
        case 'EXPLORER_OPEN':
            return {
                ...state,
                explorer: {
                    ...state.explorer,
                    open: true  
                }   
            }
        case 'EXPLORER_CLOSE':
            return {
                ...state,
                explorer: {
                    ...state.explorer,
                    open: false 
                } 
            }                                           
        default:
            return state
    }
}
  
export default layout        