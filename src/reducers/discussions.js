import * as utils from './utilities'

const initialState = {
    selected: null,
    loading: false,
    savings: {
    },
    saving: false,
    loadings: {
        index: false,
        indexAcl: false,
        person: false,
    }
}

const selectDiscussion = (state, action) => ({ ...state,
    selected: action.payload,
})

const discussionForm = utils.createReducer(initialState, {
    'SELECT_DISCUSSION' : selectDiscussion,
    'DISCUSSION_INDEX_LOADING' : utils.handleAsyncLoadEvents.bind(null, 'index', 'loading'),
    'DISCUSSION_INDEX_LOAD_SUCCESS' : utils.handleAsyncLoadEvents.bind(null, 'index', 'success'),
    'DISCUSSION_INDEX_LOAD_ERROR' : utils.handleAsyncLoadEvents.bind(null, 'index', 'error'),
    'DISCUSSION_INDEX_ACL_LOADING' : utils.handleAsyncLoadEvents.bind(null, 'indexAcl', 'loading'),
    'DISCUSSION_INDEX_ACL_LOAD_SUCCESS' : utils.handleAsyncLoadEvents.bind(null, 'indexAcl', 'success'),
    'DISCUSSION_INDEX_ACL_LOAD_ERROR' : utils.handleAsyncLoadEvents.bind(null, 'indexAcl', 'error'),
    'PERSON_LOADING' : utils.handleAsyncLoadEvents.bind(null, 'person', 'loading'),
    'PERSON_LOAD_SUCCESS' : utils.handleAsyncLoadEvents.bind(null, 'person', 'success'),
    'PERSON_LOAD_ERROR' : utils.handleAsyncLoadEvents.bind(null, 'person', 'error'),
})

export default discussionForm 