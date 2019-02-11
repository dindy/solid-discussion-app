import * as api from '../../api/api'


const getAbsoluteUrl = (baseUrl, relativeUrl) => {
    if (relativeUrl.substring(0,1) != '/') // not relative 
        return relativeUrl
    else return baseUrl + relativeUrl.substring(1, relativeUrl.length)
}

const validateNewDiscussion = (dispatch, getStore) => new Promise( (resolve, reject) => {
    
    dispatch({ type: 'NEW_DISCUSSION_VALIDATION_TRIGGERED', payload: null })
    
    const store = getStore()
    const webId = store.user.id
    const discussionForm = store.discussionForm
    const privateTypeIndexUrl = store.user.privateTypeIndexUrl
    
    if (discussionForm.isValid) {
        dispatch({ type: 'NEW_DISCUSSION_VALIDATION_SUCCESS', payload: null })
        return resolve({ webId, privateTypeIndexUrl, discussionForm })
    } else {
        const messageError = `Oups... something went wrong. Please check the discussion form.`
        dispatch({ type: 'NEW_DISCUSSION_VALIDATION_ERROR', payload: messageError })
        return reject(new Error(messageError))
    }
})

const saveNewContainer = (parentContainerUri, folderName, dispatch) => {
    
    dispatch({ type: 'NEW_DISCUSSION_CONTAINER_SAVING', payload: null})

    return api.createContainer(parentContainerUri, folderName).then(
        response => {
            dispatch({ type: 'NEW_DISCUSSION_CONTAINER_SAVE_SUCCESS', payload: null })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't create a container on your pod. ${error}`
            dispatch({ type: 'NEW_DISCUSSION_CONTAINER_SAVE_ERROR', payload: messageError })
            return Promise.reject(new Error(error))
        }
    )
}

const saveNewIndex = (newDiscussion, containerUri, webId, dispatch) => {

    dispatch({ type: 'NEW_DISCUSSION_INDEX_SAVING', payload: null})

    return api.createDiscussionIndex(newDiscussion, webId, containerUri).then(
        response => {
            dispatch({ type: 'NEW_DISCUSSION_INDEX_SAVE_SUCCESS', payload: null })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't create an index file on your pod. ${error}`
            dispatch({ type: 'NEW_DISCUSSION_INDEX_SAVE_ERROR', payload: messageError }) 
            return Promise.reject(new Error(error)) 
        }
    )    
}

const saveIndexFileAcl = (aclUri, indexUri, webId, dispatch) => {

    dispatch({ type: 'NEW_DISCUSSION_ACL_SAVING', payload: null})

    return api.initDiscussionAcl(aclUri, indexUri, webId).then(
        response => {
            dispatch({ type: 'NEW_DISCUSSION_ACL_SAVE_SUCCESS', payload: null })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't create an authorization file on your pod. ${error}`
            dispatch({ type: 'NEW_DISCUSSION_ACL_SAVE_ERROR', payload: messageError }) 
            return Promise.reject(new Error(error)) 
        }
    )    
}

const updatePrivateTypeIndex = (indexUri, privateTypeIndexUrl, dispatch) => {

    dispatch({ type: 'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVING', payload: null})

    return api.addDiscussionToPrivateRegistry(indexUri, privateTypeIndexUrl).then(
        response => {
            dispatch({ type: 'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVE_SUCCESS', payload: null })
            return Promise.resolve(response)
        }, 
        error => {
            const messageError = `Oups... the application couldn't add the discussion to your private type index registry. ${error}`
            dispatch({ type: 'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVE_ERROR', payload: messageError }) 
            return Promise.reject(new Error(error)) 
        } 
    )
}

export async function save(dispatch, getStore, selectDiscussion) {
    
    var privateTypeIndexUrl = null
    var discussionForm = null
    var newIndexUri = null

    // # Validate and save discussion
    try {
        // ## Validate and get data from store
        var { webId, privateTypeIndexUrl, discussionForm } = await validateNewDiscussion(dispatch, getStore)

        // ## Create a container for the discussion
        const parentContainerUri = discussionForm.path || discussionForm.storageUrl
        const newContainerResponse = await saveNewContainer(parentContainerUri, discussionForm.folderName, dispatch)
        const newContainerRelativeUri = newContainerResponse.headers.get('Location')    
        
        // ## Create index file of the discussion    
        const newContainerUri = getAbsoluteUrl(discussionForm.storageUrl, newContainerRelativeUri)  
        const newIndexResponse = await saveNewIndex(discussionForm, newContainerUri, webId, dispatch)
        const newIndexRelativeUri = newIndexResponse.headers.get('Location')
            
        // ## Create an acl file for the discussion index file
        const lNewIndexUri = getAbsoluteUrl(discussionForm.storageUrl, newIndexRelativeUri)  
        newIndexUri = lNewIndexUri
        // @TODO : ACL URI should be defined by HTTP Link header of the index file 
        // but solid server indicates an inexistant file so updating this inexistant acl file result 
        // with an error when adding participants to authorizations. That's why we create a acl file now.
        const aclUri = newIndexUri + '.acl'
        await saveIndexFileAcl(newIndexUri, aclUri, webId, dispatch) 
    
        // Create a new discussion entity in the store and select it
        dispatch({ type: 'DISCUSSION_PARSED', payload: { id: newIndexUri, name: discussionForm.name} })
        dispatch(selectDiscussion(newIndexUri))

    // # If one step fails, the discussion isn't fully created
    } catch (error) {
        return Promise.reject(error)
    } 

    // # The discussion is created but we may need to reference it in user Private Type Index
    if (discussionForm.addToPrivateTypeIndex) {
        try {
            await updatePrivateTypeIndex(newIndexUri, privateTypeIndexUrl, dispatch) 
        // ## If it fails, inform user that discussion is ok but not added to his Private Type Index
        } catch (error) {
            return Promise.resolve(false)
        } 
    }    

    return Promise.resolve(true)
}