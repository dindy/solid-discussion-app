import * as requests from './discussions.requests'
import $rdf from 'rdflib'
import { 
    createContainer, 
    createDiscussionIndex, 
    addDiscussionToPrivateRegistry, 
    loadDiscussion,
} from './api'

const computeAbsoluteUrl = (baseUrl, relativeUrl) => {
    if (relativeUrl.substring(0,1) != '/') // not relative 
        return relativeUrl
    else return baseUrl + relativeUrl.substring(1, relativeUrl.length)
}

async function saveNewDiscussion(newDiscussion, webId, privateTypeIndexUrl, dispatch) {

    dispatch({ type: 'NEW_DISCUSSION_SAVING', payload: null })
    
    const parentContainerUri = newDiscussion.path || newDiscussion.storageUrl
    
    const containerRelativeUrl = await createContainer(parentContainerUri, newDiscussion.folderName).then(
        response => Promise.resolve(response.headers.get('Location')),
        error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
    )

    if (containerRelativeUrl != undefined) {
        const containerUrl = computeAbsoluteUrl(newDiscussion.storageUrl, containerRelativeUrl)
        const indexRelativeUrl = await createDiscussionIndex(newDiscussion, webId, containerUrl).then(
            response => Promise.resolve(response.headers.get('Location')),
            error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
        )

        if (indexRelativeUrl != undefined) {
            const indexUrl = computeAbsoluteUrl(newDiscussion.storageUrl, indexRelativeUrl)
            dispatch({ type: 'NEW_DISCUSSION_SAVE_SUCCESS', payload: `The discussion has been created at ${indexUrl}` })
            if (newDiscussion.addToPrivateTypeIndex) {
                const privateTypeIndexUri = await addDiscussionToPrivateRegistry(indexUrl, privateTypeIndexUrl).then(
                    data => Promise.resolve(data),
                    error => dispatch({ 
                        type: 'NEW_DISCUSSION_SAVE_ERROR', 
                        payload: `We couldn't save the discussion in your Private Type Registry : ${error.message}` 
                    })  
                )
                console.log(privateTypeIndexUri)
            }
            handleLoadDiscussion(indexUrl, dispatch)
            handleSelectDiscussion(indexUrl, dispatch)
        }
    }
} 

function handleSelectDiscussion(indexUrl, dispatch) {
    dispatch({ type: 'SELECT_DISCUSSION', payload: indexUrl })    
}

async function handleLoadDiscussion(indexUrl, dispatch, getStore) {
    dispatch({ type: 'DISCUSSION_FETCHING', payload: null })

    const discussionFileContent = await loadDiscussion(indexUrl, dispatch, getStore).then(
        data => dispatch({ type: 'DISCUSSION_FETCH_SUCCESS', payload: null }),
        error => dispatch({ type: 'DISCUSSION_FETCH_ERROR', payload: error.message })          
    )
}

export const openDiscussion = indexUrl => (dispatch, getStore) => handleLoadDiscussion(indexUrl, dispatch, getStore)

export const selectDiscussion = indexUrl => dispatch => handleSelectDiscussion(indexUrl, dispatch)

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

export const createNewDiscussion = () => (dispatch, getStore) => {
    dispatch({ type: 'NEW_DISCUSSION_VALIDATE', payload: null })
    const store = getStore()
    const webId = store.user.id
    const discussionForm = store.discussionForm
    const privateTypeIndexUrl = store.user.privateTypeIndexUrl
    if (discussionForm.isValid) 
        saveNewDiscussion(discussionForm, webId, privateTypeIndexUrl, dispatch)      
}