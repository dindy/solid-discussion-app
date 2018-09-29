import $rdf from 'rdflib'

const initialState = {
    authenticated: false,
    webId: null,
    name: null,
    avatarUrl: null
}

const layout = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTHENTICATION_SUCCESS':
        return {
            ...state, 
            authenticated: true,
            webId: action.payload.webId      
        }        
        case 'REQUEST_PROFILE_SUCCESS':
            const mimeType = 'text/turtle'
            const store = $rdf.graph()
            let name = null
            let avatarUrl = null

            try {
                $rdf.parse(action.payload, store, state.webId, mimeType)
                
                const $hasFoafName = $rdf.sym('http://xmlns.com/foaf/0.1/name')
                const $hasVCardName = $rdf.sym('http://www.w3.org/2006/vcard/ns#fn')
                const $hasFoafImg = $rdf.sym('http://xmlns.com/foaf/0.1/img')
                const $webId = $rdf.sym(state.webId)
                const $literalFoafName = store.any($webId, $hasFoafName, undefined)
                const $literalVCardName = store.any($webId, $hasVCardName, undefined)
                const $urlFoafImg = store.any($webId, $hasFoafImg, undefined)

                if (typeof $literalFoafName !== 'undefined') 
                    name = $literalFoafName.value
                else if (typeof $literalVCardName !== 'undefined') 
                    name = $literalVCardName.value
    
                if (typeof $urlFoafImg !== 'undefined') 
                    avatarUrl = $urlFoafImg.value
                
            } catch (err) {
                console.log(err)
            }         
            return {
                ...state,
                name,
                avatarUrl
            }           
        default:
            return state
    }
}
  
export default layout        