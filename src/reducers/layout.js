const initialState = {
    leftDrawer: {
        open: true
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
        default:
            return state
    }
}
  
export default layout        