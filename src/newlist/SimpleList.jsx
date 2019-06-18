import React, { Component } from 'react'
import propTypes from 'prop-types'
import Header from './components/Header/Header'
import Items from './components/Items/Items'
import Pagination from './components/Pagination'
import _ from 'lodash'
import Error from './components/Error/Error'
import { axiosGet } from '../services/axiosHelper'
import Loader from './components/Loader/Loader'
import { Table } from '@material-ui/core'
import { deleteEmptyKeys } from './services/manager'
class SimpleList extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {
      error: {},
      items: [], 
      page: 0,
      itemsPerPage: 10,
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
    const options = _.get(this.props, 'api.options')
    const itemsPerPage = options && options.itemsPerPage 
    const dataKey = options && options.dataKey
    const totalItemsKey = options && options.totalItemsKey

    this.setState({
      itemsPerPage: itemsPerPage,
      dataKey: dataKey,
      totalItemsKey: totalItemsKey
    }, () => this.getDataFromApi())
  }

  getDataFromApi = async (params = {}) => {
    let { url, header } = this.props.api
    const { search, dataKey, totalItemsKey } = this.state
    if (_.isEmpty(this.state.items)) {
      this.setState({loading: true})
    }

    let requestParams = !_.isEmpty(params) ? params : search

    await axiosGet(url, requestParams, header)
      .then(({data, error}) => {
        let transformData = this.props.transformDataOnFetch(_.get(data, dataKey))
        let totalItems = _.get(data, totalItemsKey)
        this.setState({items: transformData, error: error, total: totalItems })
      })
    this.setState({loading:false})
  }

  /**
   * Launch search in current items fetched from the last api call.
   * Filter toLowerCase the search params and the item value targeted to be case insensitive
   */
  searchInCurrentData = (params) => {
    let { items } = this.state
    let filteredItems = _.filter(items, item => {
      let filterKey =_.get(item, Object.keys(params)[0])
      filterKey = !_.isNil(filterKey) && filterKey.toString().toLowerCase()
      if (_.includes(filterKey, params[Object.keys(params)[0]].toString().toLowerCase())) {
        return item
      }
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
  searchParams = (params) => {
    let { timerSearch } = this.props

    //set new params and concatenate
    let { search } = this.state
    let newParams = deleteEmptyKeys({...search, ...params})
    this.setState({search: newParams})
    
    this.searchInCurrentData(params)

    //After timerSearch (int), will call the API
    let duration = parseInt(timerSearch)
    clearTimeout(this.toBecalledOnce)
    this.toBecalledOnce = setTimeout(() => {
      this.getDataFromApi(newParams)
    }, duration) 
  }

  render() {
    const { items, error, loading, itemsPerPage, total } = this.state
    const { header, transformDataOnDisplay, showSearchBar } = this.props
    return (
      <React.Fragment key='list-simple'>
          <Table >
            <Header 
              header={header} 
              showSearchBar={showSearchBar} 
              searchParams={this.searchParams}
            />
              <React.Fragment>
                {loading === true ? <Loader /> :
                  !_.isEmpty(error) ? <Error /> : 
                    <Items items={items} header={header} transformDataOnDisplay={transformDataOnDisplay} itemsPerPage={itemsPerPage}/>
                }
              </React.Fragment>
            <Pagination total={total}/>
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
    options: propTypes.shape({
      itemsPerPageKey: propTypes.string,
      pageKey: propTypes.string,
      dataKey: propTypes.string,
      totalItemsKey: propTypes.string,
      totalItems: propTypes.number,
      itemsPerPage: propTypes.number,
      rowsPerPageOptions: propTypes.array
    }),
    header: propTypes.object.isRequired
  }),
  showSearchBar: propTypes.bool,
  refresh: propTypes.bool,
  transformDataOnFetch: propTypes.func
}

SimpleList.defaultProps = {
  api: {},
  showSearchBar: true,
  refresh: false,
  transformDataOnFetch: data => data,
  timerSearch: 1000
}

export default SimpleList