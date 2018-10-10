import { combineReducers } from 'redux'
import layout from './layout'
import user from './user'
import discussions from './discussions'
import discussionForm from './discussionForm'
import explorer from './explorer'
import entities from './entities'

export default combineReducers({
	layout,
	user,
	entities,
	explorer,
    discussions,
    discussionForm,
})