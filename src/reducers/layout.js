/*****************/
/* Reducer shape */
/*****************/

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

/*********************/
/* Utility functions */
/*********************/

const handleAddSnackbarMessage = (snackbarState, message) => {
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
        return handleProcessSnackbarQueue(newSnackbarState);
    }
}

const handleProcessSnackbarQueue = snackbarState => {
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

const handleSnackbarClose = (snackbarState, action) => {
    if (action.payload === 'clickaway') return snackbarState 
    return handleOpenClose(snackbarState, false)
}

const handleOpenClose = (storeObject, value) => ({ ...storeObject, open: value }) 

/**************************/
/* Case reducer functions */
/**************************/

const newDiscussionLaunch = (state, action) => ({ ...state, 
    newDiscussionForm: handleOpenClose(state.newDiscussionForm, true) 
})

const newDiscussionSaveSuccess = (state, action) => ({ ...state, 
    newDiscussionForm: handleOpenClose(state.newDiscussionForm, false),
    snackbar: handleAddSnackbarMessage(state.snackbar, action.payload) 
})

const newDiscussionCancel = (state, action) => ({ ...state, 
    newDiscussionForm: handleOpenClose(state.newDiscussionForm, false) 
})

const toggleLeftDrawer = (state, action) => ({ ...state, 
    leftDrawer: handleOpenClose(state.leftDrawer, !state.leftDrawer.open) 
})

const closeLeftDrawer = (state, action) => ({ ...state, 
    leftDrawer: handleOpenClose(state.leftDrawer, false) 
})

const openLeftDrawer = (state, action) => ({ ...state, 
    leftDrawer: handleOpenClose(state.leftDrawer, true) 
})

const snackbarClose = (state, action) => ({ ...state, 
    snackbar: handleSnackbarClose(state.snackbar, action) 
})

const snackbarExited = (state, action) => ({ ...state, 
    snackbar: handleProcessSnackbarQueue(state.snackbar) 
})

const parseProfileError = (state, action) => ({ ...state, 
    snackbar: handleAddSnackbarMessage(state.snackbar, action.payload) 
})

const requestProfileError = (state, action) => ({ ...state, 
    snackbar: handleAddSnackbarMessage(state.snackbar, action.payload)         
})

const newDiscussionSaveError = (state, action) => ({ ...state, 
    snackbar: handleAddSnackbarMessage(state.snackbar, action.payload) 
})

const explorerOpen = (state, action) => ({ ...state, 
    explorer: handleOpenClose(state.explorer, true)     
})

const explorerClose = (state, action) => ({ ...state, 
    explorer: handleOpenClose(state.explorer, false)     
})

/******************/
/* Reducer switch */
/******************/

const layout = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_DISCUSSION_LAUNCH': 
            return newDiscussionLaunch(state, action)           
        case 'NEW_DISCUSSION_SAVE_SUCCESS':    
            return newDiscussionSaveSuccess(state, action) 
        case 'NEW_DISCUSSION_CANCEL':
            return newDiscussionCancel(state, action)       
        case 'TOGGLE_LEFT_DRAWER':
            return toggleLeftDrawer(state, action)       
        case 'CLOSE_LEFT_DRAWER':
            return closeLeftDrawer(state, action)       
        case 'OPEN_LEFT_DRAWER':
            return openLeftDrawer(state, action)       
        case 'SNACKBAR_CLOSE':
            return snackbarClose(state, action)                   
        case 'SNACKBAR_EXITED': 
            return snackbarExited(state, action)                              
        case 'PARSE_PROFILE_ERROR':                    
            return parseProfileError(state, action)                              
        case 'REQUEST_PROFILE_ERROR':    
            return requestProfileError(state, action)                              
        case 'NEW_DISCUSSION_SAVE_ERROR':    
            return newDiscussionSaveError(state, action)                                  
        case 'EXPLORER_OPEN':
            return explorerOpen(state, action)
        case 'EXPLORER_CLOSE':
            return explorerClose(state, action)                                             
        default:
            return state
    }
}
  
export default layout        