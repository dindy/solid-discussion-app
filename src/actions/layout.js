
export const toggleLeftDrawer = () => (dispatch) => {
    dispatch({ type: 'TOGGLE_LEFT_DRAWER', payload: null })    
}

export const closeSnackbar = (reason) => (dispatch) => {
    dispatch({ type: 'SNACKBAR_CLOSE', payload: reason })    
}

export const exitedSnackbarCallback = () => (dispatch) => {
    dispatch({ type: 'SNACKBAR_EXITED', payload: null })    
}