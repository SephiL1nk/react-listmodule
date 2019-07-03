import axios from 'axios'
import _ from 'lodash'

const setHeader = (params = {}) => {
  if (params.common !== undefined) {
    _.map(params.common, (item, key) => {
      axios.defaults.headers.common[key] = item
    })
  }
}


const axiosGet = async (url, params = {}, header = {}) => {
  setHeader(header)
  return await axios.get(url, { params })
    .then((data) => { return ({data: data}) })
    .catch((error) => { return ({error: error.response.data})})
}

export { setHeader, axiosGet }