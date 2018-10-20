import * as utils from './utilities'

const initialState = {
    selected: null,
    loading: false,
    saving: false,
}

const discussionFetching = (state, action) => ({ ...state,
    loading: true,
    error: null
})

const discussionFetchSuccess = (state, action) => ({ ...state,
    loading: false,
    error: null
})

const discussionFetchError = (state, action) => ({ ...state,
    loading: false,
    error: action.payload
})

const selectDiscussion = (state, action) => ({ ...state,
    selected: action.payload,
})

const deselectDiscussion = (state, action) => ({ ...state,
    selected: null,
})

const discussionForm = utils.createReducer(initialState, {
    'DISCUSSION_FETCHING' : discussionFetching,
    'SELECT_DISCUSSION' : selectDiscussion,
    'DISCUSSION_FETCH_SUCCESS' : discussionFetchSuccess,
    'DISCUSSION_FETCH_ERROR' : discussionFetchError,
    'DESELECT_DISCUSSION' : deselectDiscussion,
})

export default discussionForm 