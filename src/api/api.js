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
const $PURLE = new $rdf.Namespace('http://purl.org/dc/elements/1.1/')
const $XML = new $rdf.Namespace('http://www.w3.org/2001/XMLSchema#')
const $ACL = new $rdf.Namespace('http://www.w3.org/ns/auth/acl#')

export async function createContainer(parentUri, folderName, data = null) {
    return fetcher.createContainer(parentUri, folderName, data)
}

export async function initDiscussionAcl(fileUri, aclUri, webId) {
    const body = `
        @prefix acl: <http://www.w3.org/ns/auth/acl#>.
        @prefix foaf: <http://xmlns.com/foaf/0.1/>.

        <#owner>
            a acl:Authorization ;
            acl:agent <${webId}> ;
            acl:accessTo <${fileUri}> ;
            acl:mode acl:Read, acl:Write, acl:Control .
        `    
    return fetcher._fetch(aclUri, {
        method: 'PUT',
        headers: {'Content-Type': 'text/turtle'},
        body
    })
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

const update = (del, ins) => {
    return new Promise(function (resolve, reject) {
        updater.update(del, ins, (uri, ok, message) => {
            if (ok) return resolve(uri)
            else reject(new Error(message))
        })
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

const generateNewNamedNode = (uri) => store.sym(`${uri}#${(new Date()).getTime()}`)

export async function addMessageToDiscussion(content, discussionUri, webId) {
    const $message = generateNewNamedNode(discussionUri) 
    const $discussionIndex = store.sym(discussionUri)
    const $account = store.any(undefined, $SIOC('account_of'), store.sym(webId))
    const $content = $rdf.literal(content)
    const ins = [
        $rdf.st($discussionIndex, $SIOC('container_of'), $message, $discussionIndex),
        $rdf.st($message, $RDF('type'), $SIOC('Post'), $discussionIndex),
        $rdf.st($message, $SIOC('content'), $content, $discussionIndex),
        $rdf.st($message, $SIOC('has_creator'), $account, $discussionIndex),
        $rdf.st($message, $PURLE('created'), (new Date).toISOString(), $discussionIndex),
    ]
    return update([], ins).then(success => Promise.resolve($message.value))
}

export async function addParticipantToDiscussion(webId, discussionUri) {
    const $account = generateNewNamedNode(discussionUri)
    const $user = store.sym(webId)
    const $discussionIndex = store.sym(discussionUri)
    const ins = [
        $rdf.st($discussionIndex, $SIOC('has_subscriber'), $account, $discussionIndex),
        $rdf.st($account, $RDF('type'), $SIOC('User'), $discussionIndex),
        $rdf.st($account, $SIOC('account_of'), $user, $discussionIndex),
    ]
    updater.update([], ins, (uri, ok, message) => {
        if (ok) return uri
        else return new Error(message)
    })     
}

export async function addParticipantAuthorizationsToDiscussion(webId, discussionUri, authorizations) {
    const $bNode = store.bnode()
    // @TODO : ACL URI should be determined by HTTP Link header
    const $discussionAcl = store.sym(discussionUri + '.acl')
    const $discussionIndex = store.sym(discussionUri)
    const $user = store.sym(webId)
    let ins = [
        $rdf.st($bNode, $RDF('type'), $ACL('Authorization'), $discussionAcl),
        $rdf.st($bNode, $ACL('agent'), $user, $discussionAcl),
        $rdf.st($bNode, $ACL('accessTo'), $discussionIndex, $discussionAcl),
    ]
    authorizations.forEach(authorization => {
        ins = [
            ...ins,
            $rdf.st($bNode, $ACL('mode'), $ACL(authorization), $discussionAcl),            
        ]        
    })
    updater.update([], ins, (uri, ok, message) => {
        if (ok) return uri
        else return new Error(message)
    })  
}

const parseProfile = (webId) => {
    const $webId = store.sym(webId)

    const $name = store.any($webId, $VCARD('fn')) 
            || store.any($webId, $FOAF('name'))

    const $avatarUrl = store.any($webId, $VCARD('hasPhoto')) 
            || store.any($webId, $FOAF('image'))            
            || store.any($webId, $FOAF('img'))
    
    const $privateTypeIndexUrl = store.any($webId, $SOLID('privateTypeIndex')) 
    
    const $storages = store.each($webId, $PIM('storage')) || []
    
    return {
        id: $webId.value,
        name: $name ? $name.value : null,    
        avatarUrl: $avatarUrl ? $avatarUrl.value : null,    
        privateTypeIndexUrl: $privateTypeIndexUrl ? $privateTypeIndexUrl.value : null,    
        storages: $storages.map($storage => $storage.value),
    }
}

export async function loadProfile(webId) {
    return fetcher.load(webId).then( 
        response => Promise.resolve(response),
        error => Promise.reject(error)
    )
}

export async function loadAndParseProfile(webId) {
    return loadProfile(webId).then(
        response => parseProfile(webId),
        error => Promise.reject(error)
    )
}

export async function checkProfile(webId) {
    return fetcher.load(webId)
}

const extractAuthorizationsFromParsedLinkHeader = (authorizationString) => ({
    read: authorizationString.indexOf('read') !== -1,
    write: authorizationString.indexOf('write') !== -1,
    append: authorizationString.indexOf('append') !== -1,
    control: authorizationString.indexOf('control') !== -1,
})

export const parsePublicLinkHeaderAcl = (linkHeaderStr) => {
    const publicRegex = /public="((?:[a-z]|\s)+)"/
    const publicAutorizations = linkHeaderStr.match(publicRegex)
    
    return publicAutorizations === null ?
        { ...extractAuthorizationsFromParsedLinkHeader('') }
        : { ...extractAuthorizationsFromParsedLinkHeader(publicAutorizations[1]) }
}

export const parseUserLinkHeaderAcl = (linkHeaderStr) => {
    const userRegex = /user="((?:[a-z]|\s)+)"/
    const userAutorizations = linkHeaderStr.match(userRegex)
    
    return userAutorizations === null ? 
        { ...extractAuthorizationsFromParsedLinkHeader('') }
        : { ...extractAuthorizationsFromParsedLinkHeader(userAutorizations[1]) }
}

const isAThread = indexFileUri => {
    const $indexFileUri = store.sym(indexFileUri)
    const $discussionTypes = store.each($indexFileUri, $RDF('type'), undefined)
    
    return $discussionTypes.filter($type => $type.value === $SIOC('Thread').value).length > 0    
}

const parseDiscussionInfo = (indexFileUri) => {
    const $indexFileUri = store.sym(indexFileUri)
    const $title = store.any($indexFileUri, $PURL('title'), undefined)
    
    return {
        id: indexFileUri,
        title: $title ? $title.value : null,
    }
}

const parseDiscussionSuscribers = (indexFileUri) => {
    const $indexFileUri = store.sym(indexFileUri)
    const $suscribersAccounts = store.each($indexFileUri, $SIOC('has_subscriber'), undefined)
    const $participantsWebIds = $suscribersAccounts.map(($suscriberAccount) => {
        return store.any($suscriberAccount, $SIOC('account_of'), undefined)
    })
    
    return $participantsWebIds.map($webId => ({
        id: indexFileUri + ':' + $webId.value,
        personId: $webId.value,
        discussionId: indexFileUri,
        read: true,
        write: true,
        append: true,
    }))
}

const parseDiscussionMessages = (indexFileUri) => {
    const $indexFileUri = store.sym(indexFileUri)
    const $messages = store.each($indexFileUri, $SIOC('container_of'), undefined)
    
    return $messages.reduce((messages, $message) => {
        const $messageUri = store.sym($message.value)
        const $content = store.any($messageUri, $SIOC('content'), undefined)
        const $account = store.any($messageUri, $SIOC('has_creator'), undefined)
        const $person = store.any($account, $SIOC('account_of'), undefined)
        const $created = store.any($messageUri, $PURLE('created'), undefined)
        return (!!$content && !!$person && !!$created) ?
            messages.concat({
                id: $messageUri.value, 
                creatorId: $person.value,
                content: $content.value,
                discussionId: indexFileUri, 
                created: new Date($created.value)
            }) : messages

    }, [])
}

export const parseDiscussion = (indexFileUri) => isAThread(indexFileUri) ? ({
    info: parseDiscussionInfo(indexFileUri),
    suscribers: parseDiscussionSuscribers(indexFileUri),
    messages: parseDiscussionMessages(indexFileUri),
}) : null

export async function loadDiscussion(uri, force = true) {
    return fetcher.load(uri, { force }).then( 
        response => Promise.resolve(response),
        error => Promise.reject(error)
    )
}

export async function parseDiscussionAclAuthorizations (indexUri) {

    const $indexFile = store.sym(indexUri)
    const $authorizations = store.each(undefined, $ACL('accessTo'), $indexFile)
    const $agents = $authorizations.reduce((prevAgents, $authorization) => {
        return prevAgents.concat(store
            .each($authorization, $ACL('agent'))
            .map($agent => ({ ...$agent, $authorization }) )
        )
    }, [])
    
    return $agents.map($agent => Object.assign({ webId: $agent.value }, 
        { ...store
            .each($agent.$authorization, $ACL('mode'))
            .reduce((props, $mode) => {
                const mode = $mode.value.split('#')[1].toLowerCase()
                return ({ ...props, [mode]: true })
            }, {})
        }
    ))
}

export async function loadDiscussionAcl(aclUri, force = true) {
    return fetcher.load(aclUri, { force }).then( 
        response => Promise.resolve(response),
        error => Promise.reject(error)
    )
}
