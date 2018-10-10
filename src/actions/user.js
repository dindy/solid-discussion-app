import config from '../config.js'
import $rdf from 'rdflib'
const auth = window.solid.auth

async function popupLogin() {
    let session = await auth.currentSession()
    return !session ? 
        await auth.popupLogin({ popupUri: config.popupUri }) : 
        session
}

async function loadProfile(webId, dispatch) {
    auth.fetch(webId).then(
        response => {
            // If http status != 200, it's actually an error. 
            // Body should contain an error message
            if (response.status != '200') 
                return response.text().then(message => Promise.reject(new Error(message)))
                // Else it's ok parse the text
                else return response.text()
            },
        error => Promise.reject(new Error(error))
    ).then( 
        profile => dispatchProfileData(webId, profile, dispatch), 
        error => dispatch({ type: 'REQUEST_PROFILE_ERROR', payload: error.message })
    )
}

function dispatchProfileData(webId, profile, dispatch) {

    const mimeType = 'text/turtle'
    const store = $rdf.graph()

    dispatch({ type: 'REQUEST_PROFILE_SUCCESS', payload: null })
    
    try {
        $rdf.parse(profile, store, webId, mimeType)
        
        const $webId = $rdf.sym(webId)
        const $hasFoafName = $rdf.sym('http://xmlns.com/foaf/0.1/name')
        const $hasVCardName = $rdf.sym('http://www.w3.org/2006/vcard/ns#fn')
        const $hasFoafImg = $rdf.sym('http://xmlns.com/foaf/0.1/img')
        const $hasPimStorage = $rdf.sym('http://www.w3.org/ns/pim/space#storage')
        const $hasPrivateTypeIndex = $rdf.sym('https://www.w3.org/ns/solid/terms#privateTypeIndex')
        
        const $literalFoafName = store.any($webId, $hasFoafName, undefined)
        const $literalVCardName = store.any($webId, $hasVCardName, undefined)
        const $urlFoafImg = store.any($webId, $hasFoafImg, undefined)
        const $privateTypeIndex = store.any($webId, $hasPrivateTypeIndex, undefined)
        const $pimStorages = store.each($webId, $hasPimStorage, undefined)
        let person = { id: webId }

        if (typeof $literalFoafName !== 'undefined') 
            person.name = $literalFoafName.value    
        else if (typeof $literalVCardName !== 'undefined') 
            person.name = $literalVCardName.value    
            
        if (typeof $urlFoafImg !== 'undefined') 
            person.avatarUrl = $urlFoafImg.value    
            
        if (typeof $privateTypeIndex !== 'undefined') 
            person.privateTypeIndexUrl = $privateTypeIndex.value    

        dispatch({ type: 'USER_PARSED', payload: person })
        
        $pimStorages.forEach($pimStorage => {
            dispatch({ type: 'ADD_PROFILE_STORAGE', payload: $pimStorage.value })
        });

    } catch (error) {
        dispatch({ type: 'PARSE_PROFILE_ERROR', payload: error.message })
    }            
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
            dispatch({ type: 'REQUEST_PROFILE_LAUCH', payload: null })     
            // Request the profile
            loadProfile(session.webId, dispatch)
        },
        error => dispatch({ type: 'AUTHENTICATION_ERROR', payload: error })
    )    
}