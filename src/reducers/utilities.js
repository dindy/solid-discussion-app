export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

/**
* Performs a deep merge of objects and returns new object. Does not modify
* objects (immutable) and merges arrays via concatenation.
*
* @param {...object} objects - Objects to merge
* @returns {object} New object with merged key/values
*/
export function mergeDeep(...objects) {
    const isObject = obj => obj && typeof obj === 'object';
    
    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            }
            else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            }
            else {
                prev[key] = oVal;
            }
        });
      
      return prev;
    }, {});
}

export const handleAsyncSaveEvents = (state, action, key, event) => ({ ...state, 
    saving: event === 'saving' ? true : Object
        .keys(state.savings)
        .filter(lKey => lKey !== key && state.savings[lKey])
        .length > 0 ? true : false,
    error: event === 'error' ? action.payload : null,
    savings: { ...state.savings, 
        [key]: event === 'saving' ? true : false,
    }
})
