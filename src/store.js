import { createStore, combineReducers, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import logger from 'redux-logger'
import thunk from 'redux-thunk';

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
	rootReducer,
  	applyMiddleware(thunk, logger),
)