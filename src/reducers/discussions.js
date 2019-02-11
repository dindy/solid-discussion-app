import * as utils from './utilities'
const asyncSave = utils.handleAsyncSaveEvents
const asyncLoad = utils.handleAsyncLoadEvents

const initialState = {
    selected: null,
    loading: false,
    saving: false,
    savings: {
        participantIndex: false,
        participantAcl: false,        
    },
    loadings: {
        index: false,
        indexAcl: false,
        person: false,
        participantProfile: false,
    }
}

const selectDiscussion = (state, action) => ({ ...state,
    selected: action.payload,
})

const discussionForm = utils.createReducer(initialState, {
    'DISCUSSION_INDEX_LOADING' : asyncLoad.bind(null, 'index', 'loading'),
    'DISCUSSION_INDEX_LOAD_SUCCESS' : asyncLoad.bind(null, 'index', 'success'),
    'DISCUSSION_INDEX_LOAD_ERROR' : asyncLoad.bind(null, 'index', 'error'),
    'DISCUSSION_INDEX_ACL_LOADING' : asyncLoad.bind(null, 'indexAcl', 'loading'),
    'DISCUSSION_INDEX_ACL_LOAD_SUCCESS' : asyncLoad.bind(null, 'indexAcl', 'success'),
    'DISCUSSION_INDEX_ACL_LOAD_ERROR' : asyncLoad.bind(null, 'indexAcl', 'error'),
    'PERSON_LOADING' : asyncLoad.bind(null, 'person', 'loading'),
    'PERSON_LOAD_SUCCESS' : asyncLoad.bind(null, 'person', 'success'),
    'PERSON_LOAD_ERROR' : asyncLoad.bind(null, 'person', 'error'),
    'DISCUSSION_SELECTED' : selectDiscussion,
})

export default discussionForm 