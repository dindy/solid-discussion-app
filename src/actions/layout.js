
export const toggleLeftDrawer = () => dispatch => {
    dispatch({ type: 'TOGGLE_LEFT_DRAWER', payload: null })    
}

export const closeLeftDrawer = () => dispatch => {
    dispatch({ type: 'CLOSE_LEFT_DRAWER', payload: null })    
}

export const openLeftDrawer = () => dispatch => {
    dispatch({ type: 'OPEN_LEFT_DRAWER', payload: null })    
}

export const closeSnackbar = reason => dispatch => {
    dispatch({ type: 'SNACKBAR_CLOSE', payload: reason })    
}

export const exitedSnackbarCallback = () => dispatch => {
    dispatch({ type: 'SNACKBAR_EXITED', payload: null })    
}

export const closeExplorer = () => dispatch => {
    dispatch({ type: 'EXPLORER_CLOSE', payload: null })    
}