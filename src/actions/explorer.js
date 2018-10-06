import $rdf from 'rdflib'
const auth = window.solid.auth

const parseFolderData = (url, data, dispatch) => {
    const mimeType = 'text/turtle'
    const store = $rdf.graph()
    try {
        $rdf.parse(data, store, url, mimeType)
        const sparqlQuery = `SELECT ?aname
            WHERE {
                <${url}> <http://www.w3.org/ns/ldp#contains> ?aname .
                ?aname <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/ldp#Resource> .
                ?aname <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/ldp#Container> .
            }`
        const query = $rdf.SPARQLToQuery(sparqlQuery, true, store)
        store.fetcher = null;
        const callback = result => 
            dispatch({ type: 'ADD_EXPLORER_FOLDER', payload: result['?aname']['value'] })
        store.query(query, callback)
    } catch (error) {
        dispatch({ type: 'PARSE_EXPLORER_FOLDER_ERROR', payload: error.message })
    }            
}

const fetchFolder = (url, dispatch) => {
    dispatch({ type: 'SET_EXPLORER_ROOT', payload: url })   
    auth.fetch(url).then(
        response => {
            if (response.status != '200') 
                return response.text().then(message => Promise.reject(new Error(message)))
            else return response.text()
        },
        error => Promise.reject(new Error(error))
    ).then( 
        data => parseFolderData(url, data, dispatch),
        error => dispatch({ type: 'FETCH_FOLDER_ERROR', payload: error.message })
    )
}

export const openExplorer = (rootUrl, storageUrl) => dispatch => {
    // dispatch({ type: 'CLEAR_EXPLORER_FOLDERS', payload: null })
    dispatch({ type: 'EXPLORER_OPEN', payload: storageUrl })   
    fetchFolder(rootUrl, dispatch)
}

export const exploreFolder = rootUrl => dispatch => fetchFolder(rootUrl, dispatch)

export const exploreParentFolder = () => dispatch => {
    dispatch({ type: 'EXPLORER_OPEN_PARENT', payload: null })   
}

export const selectContainerForNewDiscussion = rootUrl => dispatch => {}

export const selectFolder = url => dispatch => {
    dispatch({ type: 'EXPLORER_SELECT_FOLDER', payload: url })   
    dispatch({ type: 'EXPLORER_CLOSE', payload: url })   
}