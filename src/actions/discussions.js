import * as api from '../api/api'
import * as newDiscussionDispatchers from './dispatchers/discussions-create'
import * as loadDiscussionDispatchers from './dispatchers/discussions-load'
import * as personsDispatchers from './dispatchers/persons'

async function handleSaveAddParticipant(webId, discussionUri, dispatch, getStore) {

    dispatch({ type: 'ADD_PARTICIPANT_SAVING', payload: null })

    // Check webId
    const webIdExists = await api.checkProfile(webId).then(
        response => Promise.resolve(true),
        error => dispatch({ type: 'ADD_PARTICIPANT_SAVE_ERROR', payload: error.message })            
    )
    
    // Add participant in discusion index
    if (webIdExists === true) {
        const participantAdded = await api.addParticipantToDiscussion(webId, discussionUri).then(
            response => Promise.resolve(true),
            error => dispatch({ type: 'ADD_PARTICIPANT_SAVE_ERROR', payload: error.message })          
        )
        
        // Add participant in discussion index ACL 
        if (participantAdded === true) {
            const authorizations = ['Read', 'Write']
            const authorizationAdded = await api.addParticipantAuthorizationsToDiscussion(webId, discussionUri, authorizations).then(
                response => Promise.resolve(true),
                error => dispatch({ type: 'ADD_PARTICIPANT_SAVE_ERROR', payload: error.message })                  
            )
            
            if (authorizationAdded === true) {
                dispatch({ type: 'ADD_PARTICIPANT_SUCCESS', payload: null })
                loadDiscussionDispatchers.load(discussionUri, dispatch, getStore, personsDispatchers.loadAndParsePerson)
            }
        }
    }
}

export const openDiscussion = indexUrl => (dispatch, getStore) => {
    loadDiscussionDispatchers.load(indexUrl, dispatch, getStore, personsDispatchers.loadAndParsePerson).then(
        success => dispatch({ type: 'SELECT_DISCUSSION', payload: indexUrl })   
    )
}

export const newDiscussion = () => dispatch => {
    dispatch({ type: 'DESELECT_DISCUSSION', payload: null })    
    dispatch({ type: 'NEW_DISCUSSION_LAUNCH', payload: null })    
}

export const changeNewDiscussionStorage = storageUrl => dispatch => dispatch(
    { type: 'NEW_DISCUSSION_STORAGE_URL_UPDATE', payload: storageUrl })    

export const changeNewDiscussionName = name => dispatch => dispatch(
    { type: 'NEW_DISCUSSION_NAME_UPDATE', payload: name })    

export const changeNewDiscussionPath = path => dispatch => dispatch(
    { type: 'NEW_DISCUSSION_PATH_UPDATE', payload: path })    

export const changeNewDiscussionAddPrivateIndex = added => dispatch => dispatch(
    { type: 'NEW_DISCUSSION_ADD_TO_PRIVATE_TYPE_INDEX_UPDATE', payload: added })    

export const cancelNewDiscussion = () => dispatch => dispatch(
    { type: 'NEW_DISCUSSION_CANCEL', payload: null })     

export const saveNewDiscussion = () => (dispatch, getStore) => newDiscussionDispatchers
    .save(dispatch, getStore, openDiscussion)   

export const addParticipant = () => dispatch => dispatch(
    { type: 'ADD_PARTICIPANT_LAUNCH', payload: null })    

export const addParticipantCancel = () => dispatch => dispatch(
    { type: 'ADD_PARTICIPANT_CANCEL', payload: null })    

export const saveAddParticipant = (webId, discussionUri) => (dispatch, getStore) => {
    handleSaveAddParticipant(webId, discussionUri, dispatch, getStore)
}

export const addParticipantWebIdUpdate = webId => dispatch => dispatch(
    { type: 'ADD_PARTICIPANT_WEBID_UPDATE', payload: webId })    

export const postMessage = () => (dispatch, getStore) => {
    const webId = getStore()['user']['id']
    const message = getStore()['messageForm']['content']
    const discussionUri = getStore()['discussions']['selected']
    dispatch({ type: 'POST_MESSAGE_UPDATING', payload: null })    
    api.addMessageToDiscussion(message, discussionUri, webId).then(
        messageUri => {
            dispatch({ type: 'POST_MESSAGE_UPDATED', payload: messageUri })
            loadDiscussionDispatchers.load(discussionUri, dispatch, getStore, personsDispatchers.loadAndParsePerson)
        },
        error => dispatch({ type: 'POST_MESSAGE_ERROR', payload: error.message }),
    )
}

export const setMessage = content => dispatch => dispatch(
    { type: 'SET_MESSAGE', payload: content })