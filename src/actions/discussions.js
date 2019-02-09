import * as api from '../api/api'
import * as newDiscussionActions from './newDiscussion'

// const computeAbsoluteUrl = (baseUrl, relativeUrl) => {
//     if (relativeUrl.substring(0,1) != '/') // not relative 
//         return relativeUrl
//     else return baseUrl + relativeUrl.substring(1, relativeUrl.length)
// }

// async function handleSaveNewDiscussion(newDiscussion, webId, privateTypeIndexUrl, dispatch, getStore) {

//     dispatch({ type: 'NEW_DISCUSSION_SAVING', payload: null })
    
//     const parentContainerUri = newDiscussion.path || newDiscussion.storageUrl
    
//     // Save the container
//     const containerRelativeUrl = await api.createContainer(parentContainerUri, newDiscussion.folderName).then(
//         response => Promise.resolve(response.headers.get('Location')),
//         error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
//     )

//     // If container saved, save the index file
//     if (typeof containerRelativeUrl !== 'undefined') {
//         const containerUrl = computeAbsoluteUrl(newDiscussion.storageUrl, containerRelativeUrl)
//         const indexRelativeUrl = await api.createDiscussionIndex(newDiscussion, webId, containerUrl).then(
//             response => Promise.resolve(response.headers.get('Location')),
//             error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
//         )

//         // If index saved, save the .acl and optionally update the type index registry 
//         if (typeof indexRelativeUrl !== 'undefined') {
//             const indexUrl = computeAbsoluteUrl(newDiscussion.storageUrl, indexRelativeUrl)
            
//             const aclRelativeUrl = await api.initDiscussionAcl(indexUrl, webId).then(
//                 response => Promise.resolve(response.headers.get('Location')),
//                 error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })                  
//             )
            
//             if (typeof aclRelativeUrl !== 'undefined') {
//                 dispatch({ type: 'NEW_DISCUSSION_SAVE_SUCCESS', payload: `The discussion has been created at ${indexUrl}` })
//             }

//             if (newDiscussion.addToPrivateTypeIndex) {
//                 const privateTypeIndexUri = await api.addDiscussionToPrivateRegistry(indexUrl, privateTypeIndexUrl).then(
//                     data => Promise.resolve(data),
//                     error => dispatch({ 
//                         type: 'NEW_DISCUSSION_SAVE_ERROR', 
//                         payload: `We couldn't save the discussion in your Private Type Registry : ${error.message}` 
//                     })  
//                 )
//             }

//             // Then load the discussion
//             handleOpenDiscussion(indexUrl, dispatch, getStore)
//             handleSelectDiscussion(indexUrl, dispatch)
//         }
//     }
// }

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
                handleOpenDiscussion(discussionUri, dispatch, getStore)
            }
        }
    }
}

function handleSelectDiscussion(indexUrl, dispatch) {
    dispatch({ type: 'SELECT_DISCUSSION', payload: indexUrl })    
}

async function handleOpenDiscussion(indexUri, dispatch, getStore) {

    dispatch({ type: 'DISCUSSION_FETCHING', payload: null })
    
    // @TODO : ACL URI should be determined by HTTP Link header          
    const aclUri = indexUri + '.acl'    
    
    // Dispatch discussion, participants and messages
    try {
        // Load index file of the discussion
        const response = await api.loadDiscussion(indexUri)
        dispatch({ type: 'DISCUSSION_FETCH_SUCCESS', payload: null })
        
        // Parse discussion from the response and dispatch participants and messages
        const { messages, suscribers, info } = await api.parseDiscussion(indexUri)
        suscribers.forEach(suscriber => {
            dispatch({ type: 'PARTICIPANT_PARSED', payload: suscriber })
            api.loadAndParseProfile(suscriber.personId).then(
                (parsed) => dispatch({ type: 'PERSON_PARSED', payload: parsed }), 
                (error) => Promise.reject()/* @TODO : Handle errors fetching progile */
            )            
        })
        messages.forEach(message => dispatch({ type: 'MESSAGE_PARSED', payload: message }))
        
        // Extract and dispatch public authorizations from the response
        const wacAllowHeader = response.headers.get('WAC-Allow')
        const publicAuth = api.parsePublicLinkHeaderAcl(wacAllowHeader)
        dispatch({ type: 'DISCUSSION_PARSED', payload: { ...info, public: publicAuth } })
        
        // Extract and dispatch user's authorizations from the response 
        // to update his authorizations for the discussion
        const userWebId = getStore()['user']['id'] 
        if (userWebId !== null) {
            const userAuth = api.parseUserLinkHeaderAcl(wacAllowHeader)
            dispatch({ type: 'PARTICIPANT_PARSED', payload: { 
                id: info.id + ':' + userWebId,
                personId: userWebId,
                discussionId: info.id,
            }})
        }
        
        // Load acl file
        const aclRdf = await api.loadDiscussionAcl(aclUri)
        
        // Extract and dispatch participants from acl to update 
        // or add authorizations for the discussion
        const authorizations = await api.parseDiscussionAclAuthorizations(indexUri) 
        authorizations.forEach(participant => dispatch({ 
            type: 'PARTICIPANT_PARSED', 
            payload: {
                id: info.id + ':' + participant.webId,
                personId: participant.webId,
                discussionId: indexUri,
            }
        }))
        
    } catch (error) {
        dispatch({ type: 'DISCUSSION_FETCH_ERROR', payload: `We couldn't read the conversation : ${indexUri} : ${error.message}` })
    }    
}

export const openDiscussion = indexUrl => (dispatch, getStore) => handleOpenDiscussion(indexUrl, dispatch, getStore)

export const selectDiscussion = indexUrl => (dispatch) => handleSelectDiscussion(indexUrl, dispatch)

export const newDiscussion = () => dispatch => {
    dispatch({ type: 'DESELECT_DISCUSSION', payload: null })    
    dispatch({ type: 'NEW_DISCUSSION_LAUNCH', payload: null })    
}

export const changeNewDiscussionStorage = storageUrl => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_STORAGE_URL_UPDATE', payload: storageUrl })    
}

export const changeNewDiscussionName = name => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_NAME_UPDATE', payload: name })    
}

export const changeNewDiscussionPath = path => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_PATH_UPDATE', payload: path })    
}

export const changeNewDiscussionAddPrivateIndex = added => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_ADD_TO_PRIVATE_TYPE_INDEX_UPDATE', payload: added })    
}

export const cancelNewDiscussion = () => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_CANCEL', payload: null })    
}

export const deselectDiscussion = () => dispatch => {
    dispatch({ type: 'DESELECT_DISCUSSION', payload: null })    
}

export const saveNewDiscussion = () => (dispatch, getStore) => {
    newDiscussionActions.handleSaveNewDiscussion(dispatch, getStore, selectDiscussion, openDiscussion)
    // dispatch({ type: 'NEW_DISCUSSION_VALIDATE', payload: null })
    // const store = getStore()
    // const webId = store.user.id
    // const discussionForm = store.discussionForm
    // const privateTypeIndexUrl = store.user.privateTypeIndexUrl
    // if (discussionForm.isValid) 
    //     handleSaveNewDiscussion(discussionForm, webId, privateTypeIndexUrl, dispatch, getStore)      
}

export const addParticipant = () => dispatch => {
    dispatch({ type: 'ADD_PARTICIPANT_LAUNCH', payload: null })    
}

export const addParticipantCancel = () => dispatch => {
    dispatch({ type: 'ADD_PARTICIPANT_CANCEL', payload: null })    
}

export const saveAddParticipant = (webId, discussionUri) => (dispatch, getStore) => {
    // dispatch({ type: 'ADD_PARTICIPANT_VALIDATE', payload: null })
    // const store = getStore()
    // if (store.participantForm.isValid) 
        handleSaveAddParticipant(webId, discussionUri, dispatch, getStore)
}


export const addParticipantWebIdUpdate = webId => dispatch => {
    dispatch({ type: 'ADD_PARTICIPANT_WEBID_UPDATE', payload: webId })    
}

export const postMessage = () => (dispatch, getStore) => {
    const webId = getStore()['user']['id']
    const message = getStore()['messageForm']['content']
    const discussionUri = getStore()['discussions']['selected']
    dispatch({ type: 'POST_MESSAGE_UPDATING', payload: null })    
    api.addMessageToDiscussion(message, discussionUri, webId).then(
        messageUri => {
            dispatch({ type: 'POST_MESSAGE_UPDATED', payload: messageUri })
            handleOpenDiscussion(discussionUri, dispatch, getStore)
        },
        error => dispatch({ type: 'POST_MESSAGE_ERROR', payload: error.message }),
    )
}

export const setMessage = content => dispatch => {
    dispatch({ type: 'SET_MESSAGE', payload: content })
}