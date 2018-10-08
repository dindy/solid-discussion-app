const auth = window.solid.auth

export const newDiscussion = () => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_LAUNCH', payload: null })    
}

async function saveContainer(newDiscussion) {

    const body = `<> <http://purl.org/dc/terms/title> "${newDiscussion.name}" .`
    const topContainerUrl = newDiscussion.path || newDiscussion.storageUrl
    
    return auth.fetch(topContainerUrl, {
        method: 'POST',
        headers: {
            'Slug': newDiscussion.folderName,
            'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
            'Content-Type': 'text/turtle',
        },
        body
    }).then(
        response => {
            if (response.status.toString().substring(0,2) == '20') 
                return response.headers.get('Location')
            if (response.status == '403') 
                return Promise.reject(new Error(`You are not authorized to create a resource in ${topContainerUrl}.`))
            if (response.status == '401') 
                return Promise.reject(new Error(`You are not authenticated.`))
            if (response.status == '404') 
                return Promise.reject(new Error(`The resource ${topContainerUrl} couldn't be found.`))
            return Promise.reject(new Error(`An error occured while creating ${newDiscussion.folderName} in ${topContainerUrl}`))
        },
        error => Promise.reject(new Error(error.message))
    )
}

async function saveIndexFile(newDiscussion, webId, containerUrl) {
    const body = `
        @prefix : <#> .
        @prefix sioc: <http://rdfs.org/sioc/ns#> .
        @prefix purl: <http://purl.org/dc/elements/1.1/> .
        @prefix foaf: <http://xmlns.com/foaf/0.1/> .

        <> 
            a sioc:Thread ;
            <http://purl.org/dc/terms/title> "${newDiscussion.name}" ;
            sioc:has_subscriber <#account1> .
        
        <#account1>
            a sioc:User ;
            sioc:account_of <${webId}> .
    `
    return auth.fetch(containerUrl, {
        method: 'POST',
        headers: {
            'Slug': 'index',
            'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
            'Content-Type': 'text/turtle',
        },
        body
    }).then(
        response => {
            if (response.status.toString().substring(0,2) == '20') 
                return response.headers.get('Location')
            if (response.status == '403') 
                return Promise.reject(new Error(`You are not authorized to create a resource in ${containerUrl}.`))
            if (response.status == '401') 
                return Promise.reject(new Error(`You are not authenticated.`))
            if (response.status == '404') 
                return Promise.reject(new Error(`The resource ${containerUrl} couldn't be found.`))
            return Promise.reject(new Error(`An error occured while creating index.ttl in ${containerUrl}`))
        },
        error => Promise.reject(new Error(error.message))
    )    
}

const getAbsoluteUrl = (baseUrl, relativeUrl) => {
    if (relativeUrl.substring(0,1) != '/') // not relative 
        return relativeUrl
    else return baseUrl + relativeUrl.substring(1, relativeUrl.length)
}

async function addDiscussionToPrivateRegistry (indexRelativeUrl, privateTypeIndexUrl) {
    const SOLID = 'https://www.w3.org/ns/solid/terms#';
    const SIOC = 'http://rdfs.org/sioc/ns#';                
    const body = `
        INSERT DATA {
            [] 
                a <${SOLID}TypeRegistration> ;
                <${SOLID}forClass> <${SIOC}Thread> ; 
                <${SOLID}instance> <${indexRelativeUrl}> .
        }`

    // Send a PATCH request to update the source
    return auth.fetch(privateTypeIndexUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/sparql-update' },
        body,
    }).then(
        response => {
            if (response.status.toString().substring(0,2) == '20') 
                return response.headers.get('Location')
            if (response.status == '403') 
                return Promise.reject(new Error(`You are not authorized to update your private type index.`))
            if (response.status == '401') 
                return Promise.reject(new Error(`You are not authenticated.`))
            if (response.status == '404') 
                return Promise.reject(new Error(`Your private type index couldn't be found.`))
            return Promise.reject(new Error(`An error occured while updating your private type index.`))
        },
        error => Promise.reject(new Error(error.message))
    )          
}

async function saveNewDiscussion(newDiscussion, webId, privateTypeIndexUrl, dispatch) {
    
    const containerRelativeUrl = await saveContainer(newDiscussion).then(
        data => Promise.resolve(data),
        error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
    )
    if (containerRelativeUrl != undefined) {
        const containerUrl = getAbsoluteUrl(newDiscussion.storageUrl, containerRelativeUrl)
        const indexRelativeUrl = await saveIndexFile(newDiscussion, webId, containerUrl).then(
            data => Promise.resolve(data),
            error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
        )
        if (indexRelativeUrl != undefined) {
            const indexUrl = getAbsoluteUrl(newDiscussion.storageUrl, indexRelativeUrl)
            dispatch({ type: 'NEW_DISCUSSION_SAVE_SUCCESS', payload: `The discussion has been created at ${indexUrl}` })
            if (newDiscussion.addToPrivateIndex) {
                await addDiscussionToPrivateRegistry(indexRelativeUrl, privateTypeIndexUrl).then(
                    data => Promise.resolve(data),
                    error => dispatch({ type: 'NEW_DISCUSSION_SAVE_ERROR', payload: error.message })  
                )
            } 
        }
    }
} 

export const changeNewDiscussionStorage = storageUrl => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_STORAGE_URL', payload: storageUrl })    
}

export const changeNewDiscussionName = name => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_NAME', payload: name })    
}

export const changeNewDiscussionPath = path => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_PATH', payload: path })    
}

export const changeNewDiscussionAddPrivateIndex = added => dispatch => {
    dispatch({ type: 'SET_NEW_DISCUSSION_ADD_PRIVATE_INDEX', payload: added })    
}

export const cancelNewDiscussion = added => dispatch => {
    dispatch({ type: 'NEW_DISCUSSION_CANCEL', payload: added })    
}

export const createNewDiscussion = () => (dispatch, getStore) => {
    dispatch({ type: 'NEW_DISCUSSION_VALIDATE', payload: null })
    const store = getStore()
    const webId = store.user.webId
    const privateTypeIndexUrl = store.user.privateTypeIndexUrl
    if (store.discussions.newDiscussion.isValid) 
        saveNewDiscussion(store.discussions.newDiscussion, webId, privateTypeIndexUrl, dispatch)      
}