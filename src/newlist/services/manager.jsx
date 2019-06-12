transformOptionsToParams = (datas) => {
  const { itemsPerPageKey, pageKey } = datas.api.options
  const { itemsPerPage, page, order, orderBy } = datas.state
  let { searchParams } = datas.state

  this.applyRulesToParams(searchParams)

  let params = {}
  params[itemsPerPageKey ? itemsPerPageKey : 'itemsPerPage'] = itemsPerPage
  params[pageKey ? pageKey : 'page'] = page +1
  //During this merge, latest take precedence, as with extraParams needs to be overwrite by searchParams
  params = {...params, ...searchParams}
  if (order !== '') {
    params['order'] = {[orderBy]: order}
  }

  return params
}

applyRulesToParams = (datas) => {
  //apply search rules for search fields
  _.map(this.props.header, column => {
    if (column.search && column.search.suffix) {
      renameKey(datas, column.id, column.id+column.search.suffix)
    }
  })
}

export { transformOptionsToParams }