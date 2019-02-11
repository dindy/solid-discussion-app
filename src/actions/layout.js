export const toggleLeftDrawer = () => dispatch => {
    dispatch({ type: 'LEFT_DRAWER_TOGGLED', payload: null })    
}

export const closeLeftDrawer = () => dispatch => {
    dispatch({ type: 'LEFT_DRAWER_CLOSED', payload: null })    
}

export const openLeftDrawer = () => dispatch => {
    dispatch({ type: 'LEFT_DRAWER_OPENED', payload: null })    
}

export const toggleDiscussionDrawer = () => dispatch => {
    dispatch({ type: 'DISCUSSION_DRAWER_TOGGLE', payload: null })    
}

export const closeDiscussionDrawer = () => dispatch => {
    dispatch({ type: 'DISCUSSION_DRAWER_CLOSED', payload: null })    
}

export const openDiscussionDrawer = () => dispatch => {
    dispatch({ type: 'DISCUSSION_DRAWER_OPENED', payload: null })    
}

export const closeSnackbar = reason => dispatch => {
    dispatch({ type: 'SNACKBAR_CLOSED', payload: reason })    
}

export const exitedSnackbarCallback = () => dispatch => {
    dispatch({ type: 'SNACKBAR_EXITED', payload: null })    
}

export const closeExplorer = () => dispatch => {
    dispatch({ type: 'EXPLORER_CLOSED', payload: null })    
}