import { push } from 'react-router-redux'

export const toggleLeftDrawer = () => (dispatch) => {
    dispatch({ type: 'TOGGLE_LEFT_DRAWER', payload: null })    
}