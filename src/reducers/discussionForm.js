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
    'DISCUSSION_FORM_OPENED' : newDiscussionLaunch,
    'DISCUSSION_FORM_STORAGE_SET' : newDiscussionStorageUrlUpdate,
    'DISCUSSION_FORM_NAME_SET' : newDiscussionNameUpdate,
    'DISCUSSION_FORM_ADD_TO_PRIVATE_TYPE_INDEX_SET' : newDiscussionAddToPrivateTypeIndexUpdate,
    'DISCUSSION_FORM_PATH_SET' : newDiscussionPathUpdate,
    'EXPLORER_SELECT_FOLDER' : newDiscussionPathUpdate,
    'DISCUSSION_FORM_VALIDATION_TRIGGERED' : newDiscussionValidate,
    'DISCUSSION_FORM_CONTAINER_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'container', 'saving'),
    'DISCUSSION_FORM_CONTAINER_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'container', 'success'),
    'DISCUSSION_FORM_CONTAINER_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'container', 'error'),
    'DISCUSSION_FORM_INDEX_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'index', 'saving'),
    'DISCUSSION_FORM_INDEX_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'index', 'success'),
    'DISCUSSION_FORM_INDEX_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'index', 'error'),
    'DISCUSSION_FORM_ACL_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'acl', 'saving'),
    'DISCUSSION_FORM_ACL_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'acl', 'success'),
    'DISCUSSION_FORM_ACL_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'acl', 'error'),
    'DISCUSSION_FORM_PRIVATE_TYPE_INDEX_SAVING' : utils.handleAsyncSaveEvents.bind(null, 'privateTypeIndex', 'saving'),
    'DISCUSSION_FORM_PRIVATE_TYPE_INDEX_SAVE_SUCCESS' : utils.handleAsyncSaveEvents.bind(null, 'privateTypeIndex', 'success'),
    'DISCUSSION_FORM_PRIVATE_TYPE_INDEX_SAVE_ERROR' : utils.handleAsyncSaveEvents.bind(null, 'privateTypeIndex', 'error'),
});

export default discussionForm 