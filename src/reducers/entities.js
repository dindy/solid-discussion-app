import * as utils from './utilities'

const initialState = {
    persons: {
        byId: [],
        allIds: [],
    },
    discussions: {
        byId: [],
        allIds: [],
    },
    participants: {
        byId: [],
        allIds: [],
    }
}

const exists = (state, entityType, entityId) => state[entityType].allIds.includes(entityId)

const merge = (state, entityType, entity) => ({
    ...state, 
    [entityType]: { 
        ...state[entityType],
        byId: {
            ...state[entityType].byId,
            [entity.id]: exists(state, entityType, entity.id) ? { 
                    ...state[entityType].byId[entity.id], 
                    ...entity 
                } : entity                  
        },
        allIds: exists(state, entityType, entity.id) ? 
            state[entityType].allIds : [
                ...state[entityType].allIds,
                entity.id
            ] 
    }
})

const mergePerson = (state, action) => merge(state, 'persons', action.payload)

const mergeDiscussion = (state, action) => merge(state, 'discussions', action.payload)

const mergeParticipant = (state, action) => merge(state, 'participants', action.payload)

const entities = utils.createReducer(initialState, {
    'PERSON_PARSED' : mergePerson,
    'USER_PARSED' : mergePerson,
    'DISCUSSION_PARSED' : mergeDiscussion,
    'PARTICIPANT_PARSED' : mergeParticipant,
});

export default entities                