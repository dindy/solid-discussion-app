import * as utils from './utilities'

const initialState = {
    webId: null,
    error: null,
    isValid: false,
}

const addParticipantWebIdUpdate = (state, action) => ({ ...state,
    webId: action.payload
})

const participantForm = utils.createReducer(initialState, {
    'ADD_PARTICIPANT_WEBID_UPDATE': addParticipantWebIdUpdate
});

export default participantForm 