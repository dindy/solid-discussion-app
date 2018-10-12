const $rdf = window.$rdf

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store)
const updater = new $rdf.UpdateManager(store)

const $FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/')
const $VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#')
const $PIM = new $rdf.Namespace('http://www.w3.org/ns/pim/space#')
const $SOLID = new $rdf.Namespace('https://www.w3.org/ns/solid/terms#')
const $PURL = new $rdf.Namespace('http://purl.org/dc/terms/')
const $SIOC = new $rdf.Namespace('http://rdfs.org/sioc/ns#')
const $RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const $RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')

export async function createContainer(parentUri, folderName, data = null) {
    return fetcher.createContainer(parentUri, folderName, data)
}

export async function createDiscussionIndex(newDiscussion, webId, parentUri) {
    const data = `
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
    return fetcher._fetch(parentUri, {
        method: 'POST',
        headers: {
            // Ask the server to use this slug to name the file
            'Slug': 'index',
            // Ask the server to add the type ldp#Resource to the posted document 
            'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
            // The document is a turtle document
            'Content-Type': 'text/turtle',
        },
        data
    })
}

export async function addDiscussionToPrivateRegistry(discussionIndexRelativeUri, privateTypeIndexUri) {
    const $bNode = store.bnode()
    const $privateTypeIndex = store.sym(privateTypeIndexUri)
    const $discussionIndex = store.sym(discussionIndexRelativeUri)
    const ins = [
        $rdf.st($bNode, $RDF('type'), $SOLID('TypeRegistration'), $privateTypeIndex),
        $rdf.st($bNode, $SOLID('forClass'), $SIOC('Thread'), $privateTypeIndex),
        $rdf.st($bNode, $SOLID('instance'), $discussionIndex, $privateTypeIndex),
    ]
    updater.update([], ins, (uri, ok, message) => {
        if (ok) return uri
        else return new Error(message)
    })       
}

const parseProfile = (webId, dispatch) => {
    const $webId = store.sym(webId)

    const $name = store.any($webId, $VCARD('fn')) 
            || store.any($webId, $FOAF('name'))

    const $avatarUrl = store.any($webId, $VCARD('hasPhoto')) 
            || store.any($webId, $FOAF('image'))            
            || store.any($webId, $FOAF('img'))
    
    const $privateTypeIndexUrl = store.any($webId, $SOLID('privateTypeIndex')) 
    
    const $storages = store.each($webId, $PIM('storage')) || []
    
    const profile = {
        id: $webId.value,
        name: $name ? $name.value : null,    
        avatarUrl: $avatarUrl ? $avatarUrl.value : null,    
        privateTypeIndexUrl: $privateTypeIndexUrl ? $privateTypeIndexUrl.value : null,    
        storages: $storages.map($storage => $storage.value),
    }

    dispatch({ type: 'PERSON_PARSED', payload: profile })
    
    return profile
}

export async function loadProfile(webId, dispatch) {
    return fetcher.load(webId).then( 
        response => parseProfile(webId, dispatch),
        error => Promise.reject(error.message)
    )
}