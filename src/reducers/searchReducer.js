function search(state, action) {
  if (action == null) {
    return state
  }
  if (action.type === "1") {
    return state + 1
  } else {
    return state + 2
  }

}

export default search;