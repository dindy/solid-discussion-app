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
    'MESSAGE_SAVING' : postMessageUpdating,
    'MESSAGE_SAVE_SUCCESS' : postMessageUpdated,
    'MESSAGE_SAVE_ERROR' : postMessageError,
    'MESSAGE_SET' : setMessage,
})

export default discussionForm     