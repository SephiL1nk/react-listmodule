import React, { Component } from 'react'
import propTypes from 'prop-types'
import Header from './components/Header/Header'
import Items from './components/Items/Items'
import Pagination from './components/Pagination/Pagination'
import _ from 'lodash'
import Error from './components/Error/Error'
import { axiosGet } from './services/axiosHelper'
import Loader from './components/Loader/Loader'
import { Table } from '@material-ui/core'
import { deleteEmptyKeys, filterObjectKeyByRegex, filterByRegex } from './services/manager'
class SimpleList extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {
      error: {},
      items: [], 
      page: 0,
      rowsPerPage: 10,
      total: 0,
      loading: true,
      order: '',
      orderBy: '',
      dataKey: '',
      totalItemsKey: '',
      search: {
      }
    }
  }

  componentDidMount() {
    const { pagination } = this.props
    const rowsPerPage = pagination && pagination.rowsPerPage 
    const dataKey = pagination && pagination.dataKey
    const totalItemsKey = pagination && pagination.totalItemsKey

    this.setState({
      rowsPerPage: rowsPerPage,
      dataKey: dataKey,
      totalItemsKey: totalItemsKey
    }, () => this.getDataFromApi())
  }

  componentDidUpdate(prevProps) {
    if (this.props.refresh !== prevProps.refresh) {
      this.getDataFromApi()
    }
  }

  getDataFromApi = async () => {
    let { url, header } = this.props.api
    const { dataKey, totalItemsKey } = this.state
    if (_.isEmpty(this.state.items)) {
      this.setState({loading: true})
    }

    let requestParams = this.getSearchParams()

    await axiosGet(url, requestParams, header)
      .then(({data, error}) => {
        let transformData = this.props.transformDataOnFetch(_.get(data, dataKey))
        let totalItems = _.get(data, totalItemsKey)
        this.setState({items: transformData, error: error, total: totalItems })
      })
    this.setState({loading:false})
  }

  /**
   * Create an object with all parameters needed to perform a search :
   * Is called before every API call
   * rowsPerPageKey (should be in sync with the rowsPerPage option)
   * Page (needed page)
   * Search parameters from the search bar if there is one
   * Orderby (should be on one column if it is)
   * 
   */
  getSearchParams = () => {
    const { pagination } = this.props

    const { rowsPerPage, search, page } = this.state
    let paginateOptions = {
      [pagination.rowsPerPageKey]: rowsPerPage,
      [pagination.pageKey]: page+1
    }

    const params = {
      ...search,
      ...paginateOptions
    }

    return params
  }

  /**
   * Launch search in current items fetched from the last api call.
   * Filter toLowerCase the search params and the item value targeted to be case insensitive
   * Use the current input used by the user to filter the results
   */
  searchInCurrentData = (param) => {
    let regex = /^[\w]+/
    //Filter params to match the current columns, and avoid the [gte]|[lte] and so on.
    let filterParam = filterObjectKeyByRegex(param, regex)
    let searchKey = Object.keys(filterParam)[0]
    //construct the regexp used to search keywords form the search
    const searchRegex = new RegExp(`^${filterParam[searchKey]}`, 'igm')

    let { items } = this.state

    let filteredItems = _.filter(items, item => {
      //get the value to filter from the Item
      let valueToFilter = !_.isNil(_.get(item, searchKey)) && _.get(item, searchKey).toString().toLowerCase()

      return valueToFilter && filterByRegex(valueToFilter, searchRegex) && item 
    })
    
    this.setState({items: filteredItems})
  }

  /**
   * Performed right after a search
   * It set the new search state (params to search for) 
   * Then search in current datas from the last api call
   * Then after a timerSearch timeout, search from the real API. Timer is cleared every times the user make a search input
   * To avoid re-rendering in the middle of the 
   */
  searchParams = (currentSearchParam) => {
    let { timerSearch } = this.props

    //set new params and concatenate
    let { search } = this.state
    let newParams = deleteEmptyKeys({...search, ...currentSearchParam})
    this.setState({search: newParams, page: 0}, 
      () => this.searchInCurrentData(currentSearchParam))
    
    

    //After timerSearch (int), will call the API
    let duration = parseInt(timerSearch)
    clearTimeout(this.toBecalledOnce)
    this.toBecalledOnce = setTimeout(() => {
      this.getDataFromApi()
    }, duration) 
  }

  onChangePage = (event, page) => {
    this.setState({page}, () => this.getDataFromApi())
  }

  onChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage: event.target.value, page: 0}, () => this.getDataFromApi())
  }

  render() {
    const { items, error, loading, rowsPerPage, total, page } = this.state
    const { header, transformDataOnDisplay, showSearchBar, pagination, actions } = this.props
    return (
      <React.Fragment key='list-simple'>
          <Table >
            <Header 
              header={header} 
              showSearchBar={showSearchBar} 
              searchParams={this.searchParams} />
              <React.Fragment>
                {loading === true ? <Loader /> :
                  !_.isEmpty(error) ? <Error /> : 
                    <Items items={items} header={header} transformDataOnDisplay={transformDataOnDisplay} actions={actions} />
                }
              </React.Fragment>
            <Pagination 
              total={total} 
              page={page}
              rowsPerPageOptions={pagination.rowsPerPageOptions} 
              rowsPerPage={rowsPerPage} 
              onChangePage={this.onChangePage} 
              onChangeRowsPerPage={this.onChangeRowsPerPage}
              labelRowsPerPage={pagination.labelRowsPerPage}
              labelDisplayedRows={pagination.labelDisplayedRows} />
          </Table>
        </React.Fragment>
    )
  }
}

SimpleList.propTypes = {
  header: propTypes.array.isRequired,
  api: propTypes.object.isRequired,
  messages: propTypes.shape({
    nodata: propTypes.string,
    apierror: propTypes.string, 
  }),
  api: propTypes.shape({
    url: propTypes.string.isRequired,
    header: propTypes.object.isRequired
  }),
  pagination: propTypes.shape({
    rowsPerPageKey: propTypes.string,
    pageKey: propTypes.string,
    dataKey: propTypes.string,
    totalItemsKey: propTypes.string,
    totalItems: propTypes.number,
    rowsPerPage: propTypes.number,
    rowsPerPageOptions: propTypes.array,
    rowsPerPageText: propTypes.string
  }),
  showSearchBar: propTypes.bool,
  refresh: propTypes.bool,
  transformDataOnFetch: propTypes.func,
  actions: propTypes.func
}

SimpleList.defaultProps = {
  api: {},
  actions: () => {},
  pagination: {},
  showSearchBar: true,
  refresh: false,
  transformDataOnFetch: data => data,
  timerSearch: 1000
}

export default SimpleList