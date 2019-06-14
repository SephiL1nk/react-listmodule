import React, { Component } from 'react'
import propTypes from 'prop-types'
import Header from './components/Header/Header'
import Items from './components/Items/Items'
import Pagination from './components/Pagination'
import Search from './components/Search/Search'
import _ from 'lodash'
import Error from './components/Error/Error'
import { axiosGet } from '../services/axiosHelper'
import Loader from './components/Loader/Loader'
import { Table } from '@material-ui/core';
import { formatDataFromApiResponse } from './services/manager'

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
    }
  }

  componentDidMount() {
    const options = _.get(this.props, 'api.options')
    const itemsPerPage = options && options.itemsPerPage
    const dataKey = options && options.dataKey
    const totalItemsKey = options && options.totalItemsKey

    itemsPerPage && this.setState({itemsPerPage}) 
    dataKey && this.setState({dataKey}) 
    totalItemsKey && this.setState({totalItemsKey}) 
    this.getDataFromApi()
  }

  getDataFromApi = async () => {
    let { url, header, params } = this.props.api
    this.setState({loading: true})
    await axiosGet(url, params, header)
      .then(({data, error}) => this.setState({items: data, error: error}))
    this.setState({loading:false})
  }

  formatItems = (items) => {
    const { dataKey } = this.state
    let formattedData = _.get(items, dataKey)
    return formattedData
  }

  render() {
    const { items, error, loading, itemsPerPage } = this.state
    const { header, transformDataOnDisplay } = this.props
    return (
      <React.Fragment key='list-simple'>
        <Table >
          <Header header={header} />
          {loading === true ? <Loader /> : 
            !_.isEmpty(error) ? <Error /> :
            <React.Fragment>
              <Items items={this.formatItems(items)} header={header} transformDataOnDisplay={transformDataOnDisplay}/>
            </React.Fragment>}
        </Table>
        <Pagination />
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
  transformDataOnFetch: propTypes.func,
  transformDataOnDisplay: propTypes.func
}

SimpleList.defaultProps = {
  api: {},
  showSearchBar: true,
  refresh: false,
  transformDataOnFetch: () => {},
  transformDataOnDisplay: () => {}
}

export default SimpleList