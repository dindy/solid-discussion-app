import * as api from '../../api/api'

export const loadPerson = (webId, dispatch) => {
    
    dispatch({ type: 'PERSON_LOADING', payload: webId })
    
    return api.loadProfile(webId).then(
        response => {
            dispatch({ type: 'PERSON_LOAD_SUCCESS', payload: webId })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't load a profile. ${error}`
            dispatch({ type: 'PERSON_LOAD_ERROR', payload: messageError })
            return Promise.reject(new Error(error))
        }
    )
}

export const parsePerson = (webId, dispatch) => api.parseProfile(webId).then(
    parsed => {
        dispatch({ type: 'PERSON_PARSED', payload: parsed })
        return Promise.resolve(parsed)
    }, 
    error => {
        const messageError = `Oups... the application couldn't read a profile. ${error}`
        dispatch({ type: 'PERSON_PARSE_ERROR', payload: messageError })
        return Promise.reject(new Error(error))    
    }
)

export const loadAndParsePerson = async (webId, dispatch) => loadPerson(webId, dispatch).then(
    response => parsePerson(webId, dispatch)
)