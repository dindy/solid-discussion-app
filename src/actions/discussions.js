import * as requests from './discussions.requests'
import $rdf from 'rdflib'

const computeAbsoluteUrl = (baseUrl, relativeUrl) => {
    if (relativeUrl.substring(0,1) != '/') // not relative 
        return relativeUrl
    else return baseUrl + relativeUrl.substring(1, relativeUrl.length)
}

async function saveNewDiscussion(newDiscussion, webId, privateTypeIndexUrl, dispatch) {
    
    const containerRelativeUrl = await requests.saveContainer(newDiscussion).then(
        data => Promise.resolve(data),
        error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
    )

    if (containerRelativeUrl != undefined) {
        const containerUrl = computeAbsoluteUrl(newDiscussion.storageUrl, containerRelativeUrl)
        const indexRelativeUrl = await requests.saveIndexFile(newDiscussion, webId, containerUrl).then(
            data => Promise.resolve(data),
            error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
        )

        if (indexRelativeUrl != undefined) {
            const indexUrl = computeAbsoluteUrl(newDiscussion.storageUrl, indexRelativeUrl)
            dispatch({ type: 'NEW_DISCUSSION_SAVE_SUCCESS', payload: `The discussion has been created at ${indexUrl}` })
            if (newDiscussion.addToPrivateTypeIndex) {
                await requests.addDiscussionToPrivateRegistry(indexRelativeUrl, privateTypeIndexUrl).then(
                    data => Promise.resolve(data),
                    error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
                )
            }
            (loadDiscussion(indexUrl))(dispatch)
        }
    }
} 

async function parseDiscussionFile(discussionFileUrl, discussionFileContent, dispatch) {
    const mimeType = 'text/turtle'
    const store = $rdf.graph()
    try {
        $rdf.parse(discussionFileContent, store, discussionFileUrl, mimeType)
        
        const $indexFile = $rdf.sym(discussionFileUrl)
        const $hasTitle = $rdf.sym('http://purl.org/dc/terms/title')
        const $hasSuscriber = $rdf.sym('http://rdfs.org/sioc/ns#has_subscriber')
        const $accountOf = $rdf.sym('http://rdfs.org/sioc/ns#account_of')
        const $SiocUser = $rdf.sym('http://rdfs.org/sioc/ns#User')
        const $SiocThread = $rdf.sym('http://rdfs.org/sioc/ns#Thread')
        const $hasType = $rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')

        const $discussionTypes = store.each($indexFile, $hasType, undefined)
        const isAThread = $discussionTypes.filter($type => $type.value === $SiocThread.value).length > 0
        const $title = store.any($indexFile, $hasTitle, undefined)
        const $suscribersAccounts = store.each($indexFile, $hasSuscriber, undefined)
        const $participantsWebIds = $suscribersAccounts.map(($suscriberAccount) => {
            return store.any($suscriberAccount, $accountOf, undefined)
        })

        console.log('$participantsWebIds',$participantsWebIds)
        console.log('$indexFile', $indexFile)
    } catch (error) {
        dispatch({ type: 'DISCUSSION_PARSE_ERROR', payload: error.message })
    }                    
}

async function handleLoadDiscussion(indexUrl, dispatch) {
    console.log('indexUrl',indexUrl)
    dispatch({ type: 'DISCUSSION_FETCHING', payload: null })

    const discussionFileContent = await requests.fetch(indexUrl).then(
        data => Promise.resolve(data),
        error => dispatch({ type: 'DISCUSSION_FETCH_ERROR', payload: error.message })          
    )
    
    if (discussionFileContent != undefined) {
        const discussion = await parseDiscussionFile(indexUrl, discussionFileContent, dispatch)
        if (!!discussion)
            dispatch({ type: 'DISCUSSION_PARSED', payload: discussion })
    }
}

export const loadDiscussion = indexUrl => dispatch => handleLoadDiscussion(indexUrl, dispatch)

export const newDiscussion = () => dispatch => {
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

export const cancelNewDiscussion = added => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_CANCEL', payload: added })    
}

export const createNewDiscussion = () => (dispatch, getStore) => {
    dispatch({ type: 'NEW_DISCUSSION_VALIDATE', payload: null })
    const store = getStore()
    const webId = store.user.webId
    const discussionForm = store.discussionForm
    const privateTypeIndexUrl = store.user.privateTypeIndexUrl
    if (discussionForm.isValid) 
        saveNewDiscussion(discussionForm, webId, privateTypeIndexUrl, dispatch)      
}