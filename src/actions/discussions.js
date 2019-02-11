import * as api from '../api/api'
import * as newDiscussionDispatchers from './dispatchers/discussions-create'
import * as loadDiscussionDispatchers from './dispatchers/discussions-load'
import * as personsDispatchers from './dispatchers/persons'
import * as participantsDispatchers from './dispatchers/participants'

export const openDiscussion = indexUrl => (dispatch, getStore) => {
    dispatch({ type: 'DISCUSSION_SELECTED', payload: indexUrl })   
    loadDiscussionDispatchers.load(indexUrl, dispatch, getStore, personsDispatchers.loadAndParsePerson)
}

export const newDiscussion = () => dispatch => {
    dispatch({ type: 'DISCUSSION_SELECTED', payload: null })    
    dispatch({ type: 'DISCUSSION_FORM_OPENED', payload: null })    
}

export const changeNewDiscussionStorage = storageUrl => dispatch => dispatch(
    { type: 'DISCUSSION_FORM_STORAGE_SET', payload: storageUrl })    

export const changeNewDiscussionName = name => dispatch => dispatch(
    { type: 'DISCUSSION_FORM_NAME_SET', payload: name })    

export const changeNewDiscussionPath = path => dispatch => dispatch(
    { type: 'DISCUSSION_FORM_PATH_SET', payload: path })    

export const changeNewDiscussionAddPrivateIndex = added => dispatch => dispatch(
    { type: 'DISCUSSION_FORM_ADD_TO_PRIVATE_TYPE_INDEX_SET', payload: added })    

export const cancelNewDiscussion = () => dispatch => dispatch(
    { type: 'DISCUSSION_FORM_CANCEL', payload: null })     

export const saveNewDiscussion = () => (dispatch, getStore) => newDiscussionDispatchers
    .save(dispatch, getStore, openDiscussion)   

export const addParticipant = () => dispatch => dispatch(
    { type: 'PARTICIPANT_FORM_OPENED', payload: null })    

export const addParticipantCancel = () => dispatch => dispatch(
    { type: 'PARTICIPANT_FORM_CANCELED', payload: null })    

export const saveAddParticipant = (webId, discussionUri) => (dispatch, getStore) => {
    participantsDispatchers.handleSaveAddParticipant(
        webId, discussionUri, dispatch, getStore, loadDiscussionDispatchers.load, 
        personsDispatchers.loadAndParsePerson)
}

export const addParticipantWebIdUpdate = webId => dispatch => dispatch(
    { type: 'PARTICIPANT_WEBID_SET', payload: webId })    

export const postMessage = () => (dispatch, getStore) => {
    const webId = getStore()['user']['id']
    const message = getStore()['messageForm']['content']
    const discussionUri = getStore()['discussions']['selected']
    dispatch({ type: 'MESSAGE_SAVING', payload: null })    
    api.addMessageToDiscussion(message, discussionUri, webId).then(
        messageUri => {
            dispatch({ type: 'MESSAGE_SAVE_SUCCESS', payload: messageUri })
            loadDiscussionDispatchers.load(discussionUri, dispatch, getStore, personsDispatchers.loadAndParsePerson)
        },
        error => dispatch({ type: 'MESSAGE_SAVE_ERROR', payload: error.message }),
    )
}

export const setMessage = content => dispatch => dispatch(
    { type: 'MESSAGE_SET', payload: content })