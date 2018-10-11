import config from '../config.js'
// import $rdf from 'rdflib'
const $rdf = window.$rdf
const auth = window.solid.auth

const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store)
const $FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/')
const $VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#')
const $PIM = new $rdf.Namespace('http://www.w3.org/ns/pim/space#')
const $SOLID = new $rdf.Namespace('https://www.w3.org/ns/solid/terms#')

async function popupLogin() {
    let session = await auth.currentSession()
    return !session ? 
        await auth.popupLogin({ popupUri: config.popupUri }) : 
        session
}

const parseProfile = (webId, dispatch) => {
    const $webId = store.sym(webId)

    const name = store.any($webId, $VCARD('fn')) 
            || store.any($webId, $FOAF('name'))

    const avatarUrl = store.any($webId, $VCARD('hasPhoto')) 
            || store.any($webId, $FOAF('image'))            
            || store.any($webId, $FOAF('img'))
    
    const privateTypeIndexUrl = store.any($webId, $SOLID('privateTypeIndex')) 
    
    const storages = store.each($webId, $PIM('storage')) || []

    const profile = {
        id: $webId.value,
        name: name ? name.value : null,    
        avatarUrl: avatarUrl ? avatarUrl.value : null,    
        privateTypeIndexUrl: privateTypeIndexUrl ? privateTypeIndexUrl.value : null,    
        storages: storages.map(storage => storage.value),
    }

    dispatch({ type: 'PERSON_PARSED', payload: profile })
    
    return profile
}

async function loadProfile(webId, dispatch) {
    return fetcher.load(webId).then( 
        response => parseProfile(webId, dispatch),
        error => Promise.reject(error.message)
    )
}

export const recoverSession = () => (dispatch) => {
    auth.currentSession().then( session => {
        if (!!session) dispatch(login())
    })
} 

export const login = () => dispatch => {
    dispatch({ type: 'AUTHENTICATION_LAUNCH', payload: null })
    // Get the session
    popupLogin().then(
        session => {
            dispatch({ type: 'AUTHENTICATION_SUCCESS', payload: session })
            dispatch({ type: 'REQUEST_USER_PROFILE_LAUNCH', payload: null })     
            // Request the profile
            loadProfile(session.webId, dispatch).then(
                (parsed) => dispatch({ type: 'REQUEST_USER_PROFILE_SUCCESS', payload: parsed }), 
                (error) => dispatch({ type: 'REQUEST_USER_PROFILE_ERROR', payload: error })
            )
        },
        error => dispatch({ type: 'AUTHENTICATION_ERROR', payload: error })
    )    
}