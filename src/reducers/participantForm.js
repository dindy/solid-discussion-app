import * as utils from './utilities'
const asyncSave = utils.handleAsyncSaveEvents
const asyncLoad = utils.handleAsyncLoadEvents

const initialState = {
    webId: null,
    error: null,
    isValid: false,
}

const addParticipantWebIdUpdate = (state, action) => ({ ...state,
    webId: action.payload
})

const participantForm = utils.createReducer(initialState, {
    'PARTICIPANT_WEBID_SET': addParticipantWebIdUpdate,
    'PARTICIPANT_ACL_SAVING' : asyncSave.bind(null, 'participantAcl', 'saving'),
    'PARTICIPANT_ACL_SAVE_SUCCESS' : asyncSave.bind(null, 'participantAcl', 'success'),
    'PARTICIPANT_ACL_SAVE_ERROR' : asyncSave.bind(null, 'participantAcl', 'error'),
    'PARTICIPANT_INDEX_SAVING' : asyncSave.bind(null, 'participantIndex', 'saving'),
    'PARTICIPANT_INDEX_SAVE_SUCCESS' : asyncSave.bind(null, 'participantIndex', 'success'),
    'PARTICIPANT_INDEX_SAVE_ERROR' : asyncSave.bind(null, 'participantIndex', 'error'),
    'PARTICIPANT_PROFILE_LOADING' : asyncLoad.bind(null, 'participantProfile', 'loading'),
    'PARTICIPANT_PROFILE_LOAD_SUCCESS' : asyncLoad.bind(null, 'participantProfile', 'success'),
    'PARTICIPANT_PROFILE_LOAD_ERROR' : asyncLoad.bind(null, 'participantProfile', 'error'),    
});

export default participantForm 