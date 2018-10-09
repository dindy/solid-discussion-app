import { combineReducers } from 'redux'
import layout from './layout'
import user from './user'
import discussions from './discussions'
import discussionForm from './discussionForm'
import explorer from './explorer'

export default combineReducers({
	layout,
	user,
	explorer,
    discussions,
    discussionForm,
})