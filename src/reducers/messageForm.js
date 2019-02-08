import * as utils from './utilities'

const initialState = {
    content: null,    
    updating: false,
    error: null
}

const postMessageUpdating = (state, action) => ({ ...state,
    content: null,
    error: null,
    updating: true,
})

const setMessage = (state, action) => ({ ...state,
    content: action.payload,
})

const postMessageUpdated = (state, action) => ({ ...state,
    updating: false,
    error: null,
})

const postMessageError = (state, action) => ({ ...state,
    updating: false,
    error: action.payload,
})

const discussionForm = utils.createReducer(initialState, {
    'POST_MESSAGE_UPDATING' : postMessageUpdating,
    'POST_MESSAGE_UPDATED' : postMessageUpdated,
    'POST_MESSAGE_ERROR' : postMessageError,
    'SET_MESSAGE' : setMessage,
})

export default discussionForm     