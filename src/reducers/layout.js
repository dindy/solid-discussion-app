const initialState = {
    leftDrawer: {
        open: true
    },
    snackbar: {
        queue: [],
        open: false,
        messageInfo: {}
    }
    
}

const addSnackbarMessage = (message, snackbarState) => {
    let newSnackbarState = {
        ...snackbarState,
        queue: [
            ...snackbarState.queue,
            { message, key: new Date().getTime() }  
        ]
    }
    
    if (newSnackbarState.open) {
        // immediately begin dismissing current message to start showing new one
        return { 
            ...newSnackbarState,
            open: false
        } 
    } else {
        return processSnackbarQueue(newSnackbarState);
    }
}

const processSnackbarQueue = snackbarState => {
    if (snackbarState.queue.length > 0) {
        return {
            ...snackbarState,
            messageInfo: snackbarState.queue[0],
            open: true,
            queue: [...snackbarState.queue.slice(0, snackbarState.queue.length - 1)] 
        }
    }

    return snackbarState
}

const handleSnackbarClose = (reason, snackbarState) => {
    if (reason === 'clickaway') 
        return snackbarState 

    return {
        ...snackbarState,
        open: false
    }    
}

const layout = (state = initialState, action) => {
    switch (action.type) {
        case 'TOGGLE_LEFT_DRAWER':
            return {
                ...state, leftDrawer: {
                    ...state.leftDrawer,
                    open: !state.leftDrawer.open
                }      
            }    
        case 'SNACKBAR_CLOSE': 
            return {
                ...state, 
                snackbar: handleSnackbarClose(action.payload, state.snackbar)
            }               
        case 'SNACKBAR_EXITED': 
            return {
                ...state, 
                snackbar: processSnackbarQueue(state.snackbar)
            }                                   
        case 'REQUEST_PROFILE_ERROR':    
            return {
                ...state, 
                snackbar: addSnackbarMessage(action.payload, state.snackbar)
            }                       
        default:
            return state
    }
}
  
export default layout        