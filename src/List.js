import _ from 'lodash'
import React, { Component } from 'react'
import ItemList from './components/ItemList'
import Pagination from './components/Pagination'
import Loading from './components/Loading'
import Header from './components/Header'
import { Table } from '@material-ui/core'
import { renameKey, isFunction } from './services/objectHelper'
import { axiosGet } from './services/axiosHelper'
import PropTypes from 'prop-types'
import List from '.';

export default class ListEnhanced extends Component {
  constructor() {
    super()
    this.state = {
      data: [], 
      error: {},
      page: 0,
      itemsPerPage: 10,
      total: 0,
      loading: true,
      order: '',
      orderBy: '',
      searchParams: {}
    }
  }

  componentDidMount() {
    if (this.props.api && this.props.api.options && !_.isUndefined(this.props.api.options.itemsPerPage)) {
      const { itemsPerPage } = this.props.api.options
      this.setState({itemsPerPage})
    } 
    this.getDataFromApi()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.itemsPerPage !== this.state.itemsPerPage || prevState.page !== this.state.page || this.props.refresh !== prevProps.refresh) {
      this.getDataFromApi()
    }
  }

  getDataFromResponse = (response) => {
    const { dataKey, totalItemsKey } = this.props.api.options
    const data = !_.isUndefined(response[dataKey]) ? response[dataKey] : response
    const total = response[totalItemsKey] !== undefined ? response[totalItemsKey] : response.length
    return {data, total}
  }

  getDataFromApi = () => new Promise((resolve, reject) => {
    if (_.has(this.props.api, 'url') && _.has(this.props.api, 'header')) {
      this.setState({loading: true})
      const { url, header } = this.props.api
      const params = this.transformOptionsToParams()
      axiosGet(url, params, header).then(response => {
        let data = this.getDataFromResponse(response)
        if (isFunction(this.props.transformDataOnFetch) && data.total > 0) {
          this.props.transformDataOnFetch(data.data)
        }
  
        this.setState({...data, loading: false}, () => {
            resolve(data.data)
          })
      }).catch(error => {
        this.setState({error, loading: false}, reject(error))
      })
    } else {
      this.setState({loading: false}, reject('No API nor Header in your configuration'))
    }
  })

  applyRulesToParams = (datas) => {
    //apply search rules for search fields
    _.map(this.props.header, column => {
      if (column.search && column.search.suffix) {
        renameKey(datas, column.id, column.id+column.search.suffix)
      }
      })
  }

  transformOptionsToParams = () => {
    const { itemsPerPageKey, pageKey, extraParams } = this.props.api.options
    const { itemsPerPage, page, order, orderBy } = this.state
    let { searchParams } = this.state

    this.applyRulesToParams(searchParams)

    let params = {}
    params[itemsPerPageKey ? itemsPerPageKey : 'itemsPerPage'] = itemsPerPage
    params[pageKey ? pageKey : 'page'] = page +1
    //During this merge, latest take precedence, as with extraParams needs to be overwrite by searchParams
    params = {...params, ...extraParams, ...searchParams}
    if (order !== '') {
      params['order'] = {[orderBy]: order}
    }

    return params
  }

  handleChangePage = (event, page) => {
    this.setState({page})
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({itemsPerPage: event.target.value, page: 0})
  }

  handleRequestSort = (event, property) => {
    let orderBy = property
    let order = this.state.order === 'asc' ? 'desc' : 'asc'
    this.setState({order, orderBy}, () => this.getDataFromApi())
  }

  handleSearchRequest = (datas) => {
    this.setState({searchParams: datas}, this.getDataFromApi)
  }
  
  render() {
    const { header, actionListFunction, transformDataOnDisplay } = this.props
    const { rowsPerPageOptions } = !_.isUndefined(this.props.api) && !_.isUndefined(this.props.api.options)
    const { data, page, itemsPerPage, total, order, orderBy, loading } = this.state

    return (
      <React.Fragment>
        <Table>
          <Header {...this.props} onRequestSort={this.handleRequestSort} handleSearchRequest={this.handleSearchRequest} order={order} orderBy={orderBy}/>
          {loading === true ? <Loading /> : <ItemList actionListFunction={actionListFunction} header={header} data={data} total={total} transformDataOnDisplay={transformDataOnDisplay}/>}
          <Pagination
            page={page} 
            rowsPerPage={itemsPerPage} 
            rowsPerPageOptions={!_.isUndefined(rowsPerPageOptions) ? rowsPerPageOptions : []} 
            count={total} 
            onChangePage={(event, page) => this.handleChangePage(event, page)} 
            onChangeRowsPerPage={(event) => this.handleChangeRowsPerPage(event)} />
        </Table>
      </React.Fragment>
    )
  }
}

List.PropTypes = {
  header: PropTypes.shape({
    id: PropTypes.string.isRequired,
    numeric: PropTypes.bool,
    sortable: PropTypes.bool,
    disablePadding: PropTypes.bool,
    label: PropTypes.string.isRequired,
    search: PropTypes.shape({
      type: PropTypes.string,
      suffix: PropTypes.string,
      multiple: PropTypes.bool,
      datas: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
      ]),
      choiceByKey: PropTypes.bool
    })
  }),
  api: PropTypes.shape({
    url: PropTypes.string.isRequired,
    options: PropTypes.shape({
      itemsPerPageKey: PropTypes.string,
      pageKey: PropTypes.string,
      dataKey: PropTypes.string,
      totalItemsKey: PropTypes.string,
      totalItems: PropTypes.number,
      itemsPerPage: PropTypes.number,
      rowsPerPageOptions: PropTypes.array,
      extraParams: PropTypes.object
    }),
    header: PropTypes.object.isRequired
  }),
  showSearchBar: PropTypes.bool,
  refresh: PropTypes.bool,
  transformDataOnFetch: PropTypes.func,
  transformDataOnDisplay: PropTypes.func
}