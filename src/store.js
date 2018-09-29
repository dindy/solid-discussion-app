import { createStore, combineReducers, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import createHistory from 'history/createBrowserHistory'
import logger from 'redux-logger'
import thunk from 'redux-thunk';
import { ConnectedRouter, routerReducer, routerMiddleware} from 'react-router-redux'

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
export const store = createStore(
	rootReducer,
  	applyMiddleware(thunk, logger, middleware),
)