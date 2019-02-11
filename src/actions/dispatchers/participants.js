import * as api from '../../api/api'

const validateParticipant = (webId, dispatch, loadAndParsePerson) => {
    
    dispatch({ type: 'PARTICIPANT_PROFILE_LOADING', payload: webId })
    
    return loadAndParsePerson(webId, () => null).then(
        response => {
            dispatch({ type: 'PARTICIPANT_PROFILE_LOAD_SUCCESS', payload: null })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't reach this profile. ${error}`
            dispatch({ type: 'PARTICIPANT_PROFILE_LOAD_ERROR', payload: messageError })
            return Promise.reject(error)
        }
    )
}

const addParticipantToDiscussion = (webId, discussionUri, dispatch) => {
    
    dispatch({ type: 'PARTICIPANT_INDEX_SAVING', payload: webId })
    
    return api.addParticipantToDiscussion(webId, discussionUri).then(
        response => {
            dispatch({ type: 'PARTICIPANT_INDEX_SAVE_SUCCESS', payload: null })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't save the new participant. ${error}`
            dispatch({ type: 'PARTICIPANT_INDEX_SAVE_ERROR', payload: messageError })
            return Promise.reject(error)
        }
    )
}

const addParticipantToAcl = (webId, discussionUri, dispatch) => {
    
    const authorizations = ['Read', 'Write']
    
    dispatch({ type: 'PARTICIPANT_ACL_SAVING', payload: webId })

    return api.addParticipantAuthorizationsToDiscussion(webId, discussionUri, authorizations).then(
        response => {
            dispatch({ type: 'PARTICIPANT_ACL_SAVE_SUCCESS', payload: null })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't add authorizations for the new participant. ${error}`
            dispatch({ type: 'PARTICIPANT_ACL_SAVE_ERROR', payload: messageError })
            return Promise.reject(error)
        }
    )
}

export async function handleSaveAddParticipant(webId, discussionUri, dispatch, getStore, loadDicussion, loadAndParsePerson) {

    try {
        await validateParticipant(webId, dispatch, loadAndParsePerson)
    
        await addParticipantToDiscussion(webId, discussionUri, dispatch)

        await addParticipantToAcl(webId, discussionUri, dispatch)

        loadDicussion(discussionUri, dispatch, getStore, loadAndParsePerson)

        dispatch({ type: 'PARTICIPANT_ADDED', payload: null })

        return Promise.resolve(true)

    } catch(error) {
        return Promise.reject(new Error(error))
    }
}