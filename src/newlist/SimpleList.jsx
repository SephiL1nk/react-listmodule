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

class SimpleList extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {
      error: {},
      header: [],
      data: [], 
      error: {},
      page: 0,
      itemsPerPage: 10,
      total: 0,
      loading: true,
      order: '',
      orderBy: '',
    }
  }

  componentDidMount() {
    this.getDataFromApi()
  }

  getDataFromApi = async () => {
    let { url, header, params } = this.props.api
    this.setState({loading: true})
    await axiosGet(url, params, header)
      .then(({data, error}) => this.setState({data: data, error: error}))
    this.setState({loading:false})
  }

  render() {
    const { data, error, loading } = this.state
    const { header } = this.props
    return (
      <React.Fragment key='list-simple'>
        <Table >
          <Header header={header} />
          {loading === true ? <Loader /> : 
            !_.isEmpty(error) ? <Error /> :
            <React.Fragment>
              <Items />
              <Pagination />
            </React.Fragment>}
        </Table>
      </React.Fragment>
    )
  }
}

SimpleList.propTypes = {
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

export default SimpleList