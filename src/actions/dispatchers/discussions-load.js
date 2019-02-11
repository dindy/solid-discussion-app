import * as api from '../../api/api'

const loadIndex = (indexUri, dispatch) => {
    
    dispatch({ type: 'DISCUSSION_INDEX_LOADING', payload: indexUri})

    return api.loadDiscussion(indexUri).then(
        response => {
            dispatch({ type: 'DISCUSSION_INDEX_LOAD_SUCCESS', payload: indexUri })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't load the conversation. ${error}`
            dispatch({ type: 'DISCUSSION_INDEX_LOAD_ERROR', payload: messageError })
            return Promise.reject(error)
        }
    )
}

const parseDiscussion = async (indexUri, dispatch, loadAndParsePerson) => {
    
    var participants, messages, discussion

    // # Parse and dispatch
    try {
        // ## Parse all needed data  
        var messages = await api.parseDiscussionMessages(indexUri)  
        var participants = await api.parseDiscussionParticipants(indexUri)
        var discussion = await api.parseDiscussionInfo(indexUri)  
        
        // ## Dispatch discussion 
        dispatch({ type: 'DISCUSSION_PARSED', payload: { ...discussion } })
        
        // ## Dispatch participants 
        participants.forEach(participant => {
            dispatch({ type: 'PARTICIPANT_PARSED', payload: participant })
            loadAndParsePerson(participant.personId, dispatch)            
        })
        
        // ## Dispatch messages
        messages.forEach(message => dispatch({ type: 'MESSAGE_PARSED', payload: message }))
        
        return Promise.resolve(true)

    } catch(error) {
        return Promise.reject(new Error(error))
    }

} 

const parsePublicRights = (indexUri, response, dispatch) => {
    const wacAllowHeader = response.headers.get('WAC-Allow')
    const publicAuth = api.parsePublicLinkHeaderAcl(wacAllowHeader)
    dispatch({ type: 'DISCUSSION_PARSED', payload: { id: indexUri, public: publicAuth } })
}

const parseUserRights = (webId, indexUri, response, dispatch) => {
    const wacAllowHeader = response.headers.get('WAC-Allow')
    const userAuth = api.parseUserLinkHeaderAcl(wacAllowHeader)
    dispatch({ type: 'PARTICIPANT_PARSED', payload: { 
        id: indexUri + ':' + webId,
        personId: webId,
        discussionId: indexUri,
        ...userAuth,
    }})
}

const loadDiscussionAcl = (aclUri, dispatch) => {
    
    dispatch({ type: 'DISCUSSION_INDEX_ACL_LOADING', payload: aclUri})

    return api.loadDiscussionAcl(aclUri).then(
        response => {
            dispatch({ type: 'DISCUSSION_INDEX_ACL_LOAD_SUCCESS', payload: aclUri })
            return Promise.resolve(response)
        },
        error => {
            const messageError = `Oups... the application couldn't load the permissions of the conversation. ${error}`
            dispatch({ type: 'DISCUSSION_INDEX_ACL_LOAD_ERROR', payload: messageError })
            return Promise.reject(new Error(error))
        }
    )
}

const parseDiscussionAcl = (indexUri, dispatch) => {
    return api.parseDiscussionAclAuthorizations(indexUri).then(
        authorizations => {
            authorizations.forEach(participant => dispatch({ 
                type: 'PARTICIPANT_PARSED', 
                payload: {
                    id: indexUri + ':' + participant.webId,
                    personId: participant.webId,
                    discussionId: indexUri,
                }
            }))      
            return Promise.resolve(authorizations) 
        },
        error => {
            const messageError = `Oups... the application couldn't read the permissions of the conversation. ${error}`
            dispatch({ type: 'DISCUSSION_INDEX_ACL_PARSE_ERROR', payload: messageError })
            return Promise.reject(new Error(error))
        }
    ) 
}

export async function load(indexUri, dispatch, getStore, loadAndParsePerson) {

    // @TODO : ACL URI should be determined by HTTP Link header          
    const aclUri = indexUri + '.acl'    
    const userWebId = getStore()['user']['id'] 

    // # Dispatch discussion, participants and messages
    try {
        // ## Load index file of the discussion
        const response = await loadIndex(indexUri, dispatch)

        // ## Parse discussion from the response and dispatch participants and messages
        await parseDiscussion(indexUri, dispatch, loadAndParsePerson)
        
        // Extract and dispatch public authorizations from the response
        parsePublicRights(indexUri, response, dispatch)
        
        // Extract and dispatch user's authorizations from the response 
        // to update his authorizations for the discussion
        if (userWebId !== null) {
            parseUserRights(userWebId, indexUri, response, dispatch)
        }
        
        // Load acl file
        await loadDiscussionAcl(aclUri, dispatch)
        
        // Extract and dispatch participants from acl to update 
        // or add authorizations for the discussion
        await parseDiscussionAcl(indexUri, dispatch)
        
        return Promise.resolve(indexUri)
    } catch (error) {
        Promise.reject(error)
    }    
}