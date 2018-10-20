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
        body
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

const extractAuthorizationsFromParsedLinkHeader = (authorizationString) => ({
    read: authorizationString.indexOf('read') !== -1,
    write: authorizationString.indexOf('write') !== -1,
    append: authorizationString.indexOf('append') !== -1,
    control: authorizationString.indexOf('control') !== -1,
})

const parsePublicLinkHeaderAcl = (str, discussionId, dispatch) => {
    const publicRegex = /public="((?:[a-z]|\s)+)"/
    const publicAutorizations = str.match(publicRegex)
    if (!!publicAutorizations) dispatch({
        type: 'PARTICIPANT_PARSED',
        payload: {
            id: discussionId,
            personId: null,
            discussionId: discussionId,
            ...extractAuthorizationsFromParsedLinkHeader(publicAutorizations[1]),
        }
    })
}

const parseUserLinkHeaderAcl = (str, userWebId, discussionId, dispatch) => {
    const userRegex = /user="((?:[a-z]|\s)+)"/
    const userAutorizations = str.match(userRegex)
    if (!!userAutorizations) dispatch({
        type: 'PARTICIPANT_PARSED',
        payload: {
            id: discussionId + ':' + userWebId,
            personId: userWebId,
            discussionId: discussionId,
            ...extractAuthorizationsFromParsedLinkHeader(userAutorizations[1]),
        }
    })
}

const parseLinkHeaderAcl = (str, userWebId, discussionId, dispatch) => {
    parseUserLinkHeaderAcl(str, userWebId, discussionId, dispatch)
    parsePublicLinkHeaderAcl(str, discussionId, dispatch)
}

const parseDiscussion = (indexFileUri, response, dispatch, getStore) => {
    const userWebId = getStore()['user']['id']
    const $indexFileUri = store.sym(indexFileUri)
    const $discussionTypes = store.each($indexFileUri, $RDF('type'), undefined)
    const isAThread = $discussionTypes.filter($type => $type.value === $SIOC('Thread').value).length > 0
    const wacAllowHeader = response.headers.get('WAC-Allow')
    if (isAThread) {
        const $title = store.any($indexFileUri, $PURL('title'), undefined)
        const $suscribersAccounts = store.each($indexFileUri, $SIOC('has_subscriber'), undefined)
        const $participantsWebIds = $suscribersAccounts.map(($suscriberAccount) => {
            return store.any($suscriberAccount, $SIOC('account_of'), undefined)
        })
        const discussion = {
            id: indexFileUri,
            title: $title ? $title.value : null,
        }
        dispatch({ type: 'DISCUSSION_PARSED', payload: discussion })
        $participantsWebIds.forEach($webId => {
            loadProfile($webId.value, dispatch)
            dispatch({ type: 'PARTICIPANT_PARSED', payload: {
                id: indexFileUri + ':' + $webId.value,
                personId: $webId.value,
                discussionId: indexFileUri,
                read: true,
                write: true,
                append: true,
            }})
        })
        parseLinkHeaderAcl(wacAllowHeader, userWebId, indexFileUri, dispatch)
    } else {
        dispatch({ type: 'DISCUSSION_PARSE_ERROR', payload: `We couldn't find a discussion in ${indexFileUri}.` })
    }    
}

export async function loadDiscussion(uri, dispatch, getStore) {
    return fetcher.load(uri).then( 
        response => parseDiscussion(uri, response, dispatch, getStore),
        error => Promise.reject(error.message)
    )
}