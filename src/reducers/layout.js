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
        open: false
    },
    discussion: {
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

const addParticipantLauch = (state, action) => ({ ...state, 
    addParticipantForm: handleOpenClose(state.addParticipantForm, true),
    discussion: handleOpenClose(state.discussion, false), 
    discussionDrawer: handleOpenClose(state.discussionDrawer, false),
})

const selectDiscussion = (state, action) => ({ ...state, 
    discussion: handleOpenClose(state.discussion, true), 
    newDiscussionForm: handleOpenClose(state.newDiscussionForm, false),
})

const deselectDiscussion = (state, action) => ({ ...state, 
    discussion: handleOpenClose(state.discussion, false),
    discussionDrawer: handleOpenClose(state.discussionDrawer, false),
    addParticipantForm: handleOpenClose(state.addParticipantForm, false),
})

const addParticipantCancel = (state, action) => ({ ...state, 
    discussion: handleOpenClose(state.discussion, true), 
    discussionDrawer: handleOpenClose(state.discussionDrawer, false),
    addParticipantForm: handleOpenClose(state.addParticipantForm, false) 
})

const addParticipantClose = (state, action) => ({...state,
    discussionDrawer: handleOpenClose(state.discussionDrawer, true),
    discussion: handleOpenClose(state.discussion, true), 
    addParticipantForm: handleOpenClose(state.addParticipantForm, false) 
})

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

const explorerOpen = (state, action) => ({ ...state, 
    explorer: handleOpenClose(state.explorer, true)     
})

const explorerClose = (state, action) => ({ ...state, 
    explorer: handleOpenClose(state.explorer, false)     
})

const addSnackBarMessage = (state, action) => ({ ...state, 
    snackbar: handleAddSnackbarMessage(state.snackbar, action.payload)         
})

/******************/
/* Reducer switch */
/******************/

const discussions = utils.createReducer(initialState, {
    'ADD_PARTICIPANT_CANCEL' : addParticipantCancel,
    'ADD_PARTICIPANT_LAUNCH' : addParticipantLauch,
    'ADD_PARTICIPANT_SUCCESS' : addParticipantClose,
    'AUTHENTICATION_ERROR': addSnackBarMessage,
    'CLOSE_DISCUSSION_DRAWER' : closeDiscussionDrawer,
    'CLOSE_LEFT_DRAWER' : closeLeftDrawer,
    'DESELECT_DISCUSSION' : deselectDiscussion,
    'DISCUSSION_INDEX_LOAD_ERROR' : addSnackBarMessage,
    'DISCUSSION_INDEX_ACL_LOAD_ERROR' : addSnackBarMessage,
    'DISCUSSION_INDEX_ACL_PARSE_ERROR' : addSnackBarMessage,
    'EXPLORER_CLOSE' : explorerClose,
    'EXPLORER_OPEN' : explorerOpen,
    'NEW_DISCUSSION_LAUNCH' : newDiscussionLaunch,
    'NEW_DISCUSSION_CANCEL' : newDiscussionCancel,
    'NEW_DISCUSSION_CONTAINER_SAVE_ERROR' : addSnackBarMessage,
    'NEW_DISCUSSION_INDEX_SAVE_ERROR' : addSnackBarMessage,
    'NEW_DISCUSSION_VALIDATION_ERROR' : addSnackBarMessage,
    'NEW_DISCUSSION_ACL_SAVE_ERROR' : addSnackBarMessage,
    'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVE_ERROR' : addSnackBarMessage,
    'OPEN_DISCUSSION_DRAWER' : openDiscussionDrawer,
    'OPEN_LEFT_DRAWER' : openLeftDrawer,
    'PERSON_LOAD_ERROR' : addSnackBarMessage,
    'PERSON_PARSE_ERROR' : addSnackBarMessage,
    'POST_MESSAGE_ERROR' : addSnackBarMessage,
    'REQUEST_USER_PROFILE_ERROR' : addSnackBarMessage,
    'SELECT_DISCUSSION' : selectDiscussion,
    'SNACKBAR_CLOSE' : snackbarClose,
    'SNACKBAR_EXITED' : snackbarExited,
    'TOGGLE_DISCUSSION_DRAWER' : toggleDiscussionDrawer,
    'TOGGLE_LEFT_DRAWER' : toggleLeftDrawer,
});

export default discussions        