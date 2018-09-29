import { combineReducers } from 'redux'
import layout from './layout'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
	layout,
	router: routerReducer
})