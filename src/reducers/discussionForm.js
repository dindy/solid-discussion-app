import * as utils from './utilities'
import slug from 'slug'

const initialState = {
    path: null,
    name: null,
    nameError: null,
    storageUrl: null,
    folderName: null,
    addToPrivateTypeIndex: true,
    isValid: false,
    loading: false,
    saving: false,
    savings: {
        container: false,
        index: false,
        acl: false,
        privateTypeIndex: false,
    }
}

const newDiscussionLaunch = (state, action) => state

const newDiscussionStorageUrlUpdate = (state, action) => ({ ...state, 
    storageUrl: action.payload
})

const newDiscussionAddToPrivateTypeIndexUpdate = (state, action) => ({ ...state, 
    addToPrivateTypeIndex: action.payload
})

const newDiscussionPathUpdate = (state, action) => ({ ...state, 
    path: action.payload
        // Fix url returned by solid server @TODO : Is it a bug ?
        .replace(/(https?:\/\/)|(\/)+/g, "$1$2") 
})

const newDiscussionNameUpdate = (state, action) => ({ ...state, 
    name: action.payload,
    nameError: null,
    folderName: action.payload != '' ? slug(action.payload).toLowerCase() : null    
})

const newDiscussionValidate = (state, action) => { 
    if (state.name == '' || state.name == null) 
        return { ...state,
            nameError: 'This field is mandatory.',
            isValid: false,
        }

    return { ...state, isValid: true }
}

const discussionForm = utils.createReducer(initialState, {
    'NEW_DISCUSSION_LAUNCH' : newDiscussionLaunch,
    'NEW_DISCUSSION_STORAGE_URL_UPDATE' : newDiscussionStorageUrlUpdate,
    'NEW_DISCUSSION_NAME_UPDATE' : newDiscussionNameUpdate,
    'NEW_DISCUSSION_ADD_TO_PRIVATE_TYPE_INDEX_UPDATE' : newDiscussionAddToPrivateTypeIndexUpdate,
    'NEW_DISCUSSION_PATH_UPDATE' : newDiscussionPathUpdate,
    'EXPLORER_SELECT_FOLDER' : newDiscussionPathUpdate,
    'NEW_DISCUSSION_VALIDATION_TRIGGERED' : newDiscussionValidate,
    'NEW_DISCUSSION_CONTAINER_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'container', 'saving'),
    'NEW_DISCUSSION_CONTAINER_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'container', 'success'),
    'NEW_DISCUSSION_CONTAINER_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'container', 'error'),
    'NEW_DISCUSSION_INDEX_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'index', 'saving'),
    'NEW_DISCUSSION_INDEX_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'index', 'success'),
    'NEW_DISCUSSION_INDEX_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'index', 'error'),
    'NEW_DISCUSSION_ACL_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'acl', 'saving'),
    'NEW_DISCUSSION_ACL_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'acl', 'success'),
    'NEW_DISCUSSION_ACL_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'acl', 'error'),
    'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'privateTypeIndex', 'saving'),
    'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'privateTypeIndex', 'success'),
    'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'privateTypeIndex', 'error'),
});

export default discussionForm 