const auth = window.solid.auth

// Save a ldp basic container container (a folder on user's pod)
export async function saveContainer(newDiscussion) {
    // Body of the posted document saying that this document has a title
    const body = `<> <http://purl.org/dc/terms/title> "${newDiscussion.name}" .`
    const topContainerUrl = newDiscussion.path || newDiscussion.storageUrl
    // Use solid-auth-client to make authenticated requests
    return auth.fetch(topContainerUrl, {
        method: 'POST',
        headers: {
            // Ask the server to use this slug to name the file
            'Slug': newDiscussion.folderName,
            // Ask the server to add the type ldp#BasicContainer to the posted document 
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

// Creates an index.ttl file representing the discussion
export async function saveIndexFile(newDiscussion, webId, containerUrl) {
    // The body of the posted document. 
    // This is the turtle representation of the discussion and its participants.
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

// Update the user's private type registry by inserting a new solid:TypeRegistration 
export async function addDiscussionToPrivateRegistry (indexRelativeUrl, privateTypeIndexUrl) {
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