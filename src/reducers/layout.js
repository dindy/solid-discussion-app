import * as utils from './utilities'

/*****************/
/* Reducer shape */
/*****************/

const initialState = {
    leftDrawer: {
        open: false
    },
    discussionDrawer: {
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
    },
    addParticipantForm: {
        open: true
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

const toggleDiscussionDrawer = (state, action) => ({ ...state, 
    discussionDrawer: handleOpenClose(state.discussionDrawer, !state.discussionDrawer.open) 
})

const closeDiscussionDrawer = (state, action) => ({ ...state, 
    discussionDrawer: handleOpenClose(state.discussionDrawer, false) 
})

const openDiscussionDrawer = (state, action) => ({ ...state, 
    discussionDrawer: handleOpenClose(state.discussionDrawer, true) 
})

const snackbarClose = (state, action) => ({ ...state, 
    snackbar: handleSnackbarClose(state.snackbar, action) 
})

const snackbarExited = (state, action) => ({ ...state, 
    snackbar: handleProcessSnackbarQueue(state.snackbar) 
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

const authenticationError = (state, action) => ({ ...state,
    snackbar: handleAddSnackbarMessage(state.snackbar, action.payload)         
})

const requestProfileError = (state, action) => ({ ...state, 
    snackbar: handleAddSnackbarMessage(state.snackbar, action.payload)         
})

/******************/
/* Reducer switch */
/******************/

const discussions = utils.createReducer(initialState, {
    'NEW_DISCUSSION_LAUNCH' : newDiscussionLaunch,
    'NEW_DISCUSSION_SAVE_SUCCESS' : newDiscussionSaveSuccess,
    'NEW_DISCUSSION_CANCEL' : newDiscussionCancel,
    'TOGGLE_LEFT_DRAWER' : toggleLeftDrawer,
    'CLOSE_LEFT_DRAWER' : closeLeftDrawer,
    'OPEN_LEFT_DRAWER' : openLeftDrawer,
    'TOGGLE_DISCUSSION_DRAWER' : toggleDiscussionDrawer,
    'CLOSE_DISCUSSION_DRAWER' : closeDiscussionDrawer,
    'OPEN_DISCUSSION_DRAWER' : openDiscussionDrawer,
    'SNACKBAR_CLOSE' : snackbarClose,
    'SNACKBAR_EXITED' : snackbarExited,
    'NEW_DISCUSSION_SAVE_ERROR' : newDiscussionSaveError,
    'EXPLORER_OPEN' : explorerOpen,
    'EXPLORER_CLOSE' : explorerClose,
    'AUTHENTICATION_ERROR': authenticationError,
    'REQUEST_PROFILE_ERROR' : requestProfileError,
});

export default discussions        