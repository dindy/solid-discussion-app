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

const newDiscussionContainerSaving = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'container', 'saving') 

const newDiscussionContainerSaveSuccess = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'container', 'success')

const newDiscussionContainerSaveError = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'container', 'error')

const newDiscussionIndexSaving = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'index', 'saving')

const newDiscussionIndexSaveSuccess = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'index', 'success')

const newDiscussionIndexSaveError = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'index', 'error')

const newDiscussionAclSaving = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'acl', 'saving')

const newDiscussionAclSaveSuccess = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'acl', 'success')

const newDiscussionAclSaveError = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'acl', 'error')

const newDiscussionPrivateTypeIndexSaving = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'privateTypeIndex', 'saving')

const newDiscussionPrivateTypeIndexSaveSuccess = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'privateTypeIndex', 'success')

const newDiscussionPrivateTypeIndexSaveError = (state, action) => utils
    .handleAsyncSaveEvents(state, action, 'privateTypeIndex', 'error')

const discussionForm = utils.createReducer(initialState, {
    'NEW_DISCUSSION_LAUNCH' : newDiscussionLaunch,
    'NEW_DISCUSSION_STORAGE_URL_UPDATE' : newDiscussionStorageUrlUpdate,
    'NEW_DISCUSSION_NAME_UPDATE' : newDiscussionNameUpdate,
    'NEW_DISCUSSION_ADD_TO_PRIVATE_TYPE_INDEX_UPDATE' : newDiscussionAddToPrivateTypeIndexUpdate,
    'NEW_DISCUSSION_PATH_UPDATE' : newDiscussionPathUpdate,
    'EXPLORER_SELECT_FOLDER' : newDiscussionPathUpdate,
    'NEW_DISCUSSION_VALIDATION_TRIGGERED' : newDiscussionValidate,
    'NEW_DISCUSSION_CONTAINER_SAVING' : newDiscussionContainerSaving,
    'NEW_DISCUSSION_CONTAINER_SAVE_SUCCESS' : newDiscussionContainerSaveSuccess,
    'NEW_DISCUSSION_CONTAINER_SAVE_ERROR' : newDiscussionContainerSaveError,
    'NEW_DISCUSSION_INDEX_SAVING' : newDiscussionIndexSaving,
    'NEW_DISCUSSION_INDEX_SAVE_SUCCESS' : newDiscussionIndexSaveSuccess,
    'NEW_DISCUSSION_INDEX_SAVE_ERROR' : newDiscussionIndexSaveError,
    'NEW_DISCUSSION_ACL_SAVING' : newDiscussionAclSaving,
    'NEW_DISCUSSION_ACL_SAVE_SUCCESS' : newDiscussionAclSaveSuccess,
    'NEW_DISCUSSION_ACL_SAVE_ERROR' : newDiscussionAclSaveError,
    'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVING' : newDiscussionPrivateTypeIndexSaving,
    'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVE_SUCCESS' : newDiscussionPrivateTypeIndexSaveSuccess,
    'NEW_DISCUSSION_PRIVATE_TYPE_INDEX_SAVE_ERROR' : newDiscussionPrivateTypeIndexSaveError,
});

export default discussionForm 