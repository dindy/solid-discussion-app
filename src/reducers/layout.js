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
    newDiscussionForm: handleOpenClose(state.newDiscussionForm, true), 
    discussionDrawer: handleOpenClose(state.discussionDrawer, false) 
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
    'PARTICIPANT_FORM_CANCELED' : addParticipantCancel,
    'PARTICIPANT_FORM_OPENED' : addParticipantLauch,
    'PARTICIPANT_ADDED' : addParticipantClose,
    'AUTHENTICATION_ERROR': addSnackBarMessage,
    'DISCUSSION_DRAWER_CLOSED' : closeDiscussionDrawer,
    'LEFT_DRAWER_CLOSED' : closeLeftDrawer,
    'DISCUSSION_SELECTED' : deselectDiscussion,
    'DISCUSSION_INDEX_LOAD_ERROR' : addSnackBarMessage,
    'DISCUSSION_INDEX_ACL_LOAD_ERROR' : addSnackBarMessage,
    'DISCUSSION_INDEX_ACL_PARSE_ERROR' : addSnackBarMessage,
    'EXPLORER_CLOSED' : explorerClose,
    'EXPLORER_OPEN' : explorerOpen,
    'DISCUSSION_FORM_OPENED' : newDiscussionLaunch,
    'DISCUSSION_FORM_CANCEL' : newDiscussionCancel,
    'DISCUSSION_FORM_CONTAINER_SAVE_ERROR' : addSnackBarMessage,
    'DISCUSSION_FORM_INDEX_SAVE_ERROR' : addSnackBarMessage,
    'DISCUSSION_FORM_VALIDATION_ERROR' : addSnackBarMessage,
    'DISCUSSION_FORM_ACL_SAVE_ERROR' : addSnackBarMessage,
    'DISCUSSION_FORM_PRIVATE_TYPE_INDEX_SAVE_ERROR' : addSnackBarMessage,
    'DISCUSSION_DRAWER_OPENED' : openDiscussionDrawer,
    'LEFT_DRAWER_OPENED' : openLeftDrawer,
    'PARTICIPANT_PROFILE_LOAD_ERROR' : addSnackBarMessage,
    'PARTICIPANT_INDEX_SAVE_ERROR' : addSnackBarMessage,
    'PARTICIPANT_ACL_SAVE_ERROR' : addSnackBarMessage,    
    'PERSON_LOAD_ERROR' : addSnackBarMessage,
    'PERSON_PARSE_ERROR' : addSnackBarMessage,
    'MESSAGE_SAVE_ERROR' : addSnackBarMessage,
    'USER_PROFILE_LOAD_ERROR' : addSnackBarMessage,
    'DISCUSSION_SELECTED' : selectDiscussion,
    'SNACKBAR_CLOSED' : snackbarClose,
    'SNACKBAR_EXITED' : snackbarExited,
    'DISCUSSION_DRAWER_TOGGLE' : toggleDiscussionDrawer,
    'LEFT_DRAWER_TOGGLED' : toggleLeftDrawer,
});

export default discussions        