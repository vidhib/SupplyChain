// rootReducer.js
import { combineReducers, createStore } from 'redux'
import search from '../reducers/searchReducer'

const theDefaultReducer = (state = 0, action) => state

const firstNamedReducer = (state = 1, action) => state

const secondNamedReducer = (state = 2, action) => state

// rootReducer.js


// import theDefaultReducer, {
//   firstNamedReducer,
//   secondNamedReducer
// } from './reducers'

// Use ES6 object literal shorthand syntax to define the object shape
const rootReducer = combineReducers({
  search,
  firstNamedReducer,
  secondNamedReducer
})

export default rootReducer;
//console.log(store.getState())