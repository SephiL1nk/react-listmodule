import _ from 'lodash'
import React, { Component } from 'react'
import ItemList from './components/ItemList'
import Pagination from './components/Pagination'
import Loading from './components/Loading'
import Header from './components/Header'
import { Table, Paper, Typography } from '@material-ui/core'
import { renameKey, isFunction } from './services/objectHelper'
import { axiosGet } from './services/axiosHelper'
import propTypes from 'prop-types'

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
    const { header, actionListFunction, transformDataOnDisplay, messages } = this.props
    const { rowsPerPageOptions } = !_.isUndefined(this.props.api) && !_.isUndefined(this.props.api.options)
    const { data, page, itemsPerPage, total, order, orderBy, loading } = this.state

    if (!_.isEmpty(data) || total !== 0 || loading === true) {
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
    } else {
      return (
        <React.Fragment>
          <Paper>
            <Typography variant="h5" component="h3" className="no-data-found">
              { _.get(messages, 'nodata') ? messages.nodata : "No data where available to display this component."}
            </Typography>
          </Paper>
        </React.Fragment>
      )
    }
  }
}

ListEnhanced.propTypes = {
  header: propTypes.shape({
    id: propTypes.string.isRequired,
    numeric: propTypes.bool,
    sortable: propTypes.bool,
    disablePadding: propTypes.bool,
    label: propTypes.string.isRequired,
    search: propTypes.shape({
      type: propTypes.string,
      suffix: propTypes.string,
      multiple: propTypes.bool,
      datas: propTypes.oneOfType([
        propTypes.array,
        propTypes.object
      ]),
      choiceByKey: propTypes.bool
    })
  }),
  api: propTypes.object.isRequired,
  messages: propTypes.shape({
    nodata: propTypes.string,
    apierror: propTypes.string, 
  }),
  api: propTypes.shape({
    url: propTypes.string.isRequired,
    options: propTypes.shape({
      itemsPerPageKey: propTypes.string,
      pageKey: propTypes.string,
      dataKey: propTypes.string,
      totalItemsKey: propTypes.string,
      totalItems: propTypes.number,
      itemsPerPage: propTypes.number,
      rowsPerPageOptions: propTypes.array,
      extraParams: propTypes.object
    }),
    header: propTypes.object.isRequired
  }),
  showSearchBar: propTypes.bool,
  refresh: propTypes.bool,
  transformDataOnFetch: propTypes.func,
  transformDataOnDisplay: propTypes.func
}