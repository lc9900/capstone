import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

export default createStore(reducer, applyMiddleware(thunk, createLogger()))
export * from './reducers'
