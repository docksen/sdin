function filterNotNil(list) {
  const newList = []
  if (list) {
    for (const item of list) {
      if (item !== undefined && item !== null) {
        newList.push(item)
      }
    }
  }
  return newList
}

module.exports = {
  filterNotNil
}
