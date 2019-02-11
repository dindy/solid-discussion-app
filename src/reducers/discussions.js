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
    'PARTICIPANT_ACL_SAVING' : asyncSave.bind(null, 'participantAcl', 'saving'),
    'PARTICIPANT_ACL_SAVE_SUCCESS' : asyncSave.bind(null, 'participantAcl', 'success'),
    'PARTICIPANT_ACL_SAVE_ERROR' : asyncSave.bind(null, 'participantAcl', 'error'),
    'PARTICIPANT_INDEX_SAVING' : asyncSave.bind(null, 'participantIndex', 'saving'),
    'PARTICIPANT_INDEX_SAVE_SUCCESS' : asyncSave.bind(null, 'participantIndex', 'success'),
    'PARTICIPANT_INDEX_SAVE_ERROR' : asyncSave.bind(null, 'participantIndex', 'error'),
    'PARTICIPANT_PROFILE_LOADING' : asyncLoad.bind(null, 'participantProfile', 'loading'),
    'PARTICIPANT_PROFILE_LOAD_SUCCESS' : asyncLoad.bind(null, 'participantProfile', 'success'),
    'PARTICIPANT_PROFILE_LOAD_ERROR' : asyncLoad.bind(null, 'participantProfile', 'error'),
    'PERSON_LOADING' : asyncLoad.bind(null, 'person', 'loading'),
    'PERSON_LOAD_SUCCESS' : asyncLoad.bind(null, 'person', 'success'),
    'PERSON_LOAD_ERROR' : asyncLoad.bind(null, 'person', 'error'),
    'SELECT_DISCUSSION' : selectDiscussion,
})

export default discussionForm 