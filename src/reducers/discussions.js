import * as utils from './utilities'

const addDiscussion = (state, action) => ([ ...state, {
    url: null,
    name: null,
    storageUrl: null,
    addedToPrivateIndex: false,
    created: false,
}])

const discussions = utils.createReducer([], {
    'ADD_DISCUSSION' : addDiscussion,
});

export default discussions                