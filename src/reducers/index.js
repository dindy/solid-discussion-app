import { combineReducers } from 'redux'
import layout from './layout'
import user from './user'

export default combineReducers({
	layout,
	user,
})