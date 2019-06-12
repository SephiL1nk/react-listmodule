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

const axiosPost = (url, data, header = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    setHeader(header)
    axios({
      method: 'post',
      url: url,
      data: data,
      config: config,
      headers: header
    })
      .then(({data}) => {
        resolve(data)
      })
      .catch(error => {
        let data = error
        if (error.response !== undefined) {
          data = error.response.data
        }
        reject(data)
      })
  })
}

const axiosPut = (url, data, header = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    setHeader(header)
    axios({
      method: 'put',
      url: url,
      data: data,
      config: config
    })
      .then(({data}) => {
        resolve(data)
      })
      .catch(error => {
        let data = error
        if (error.response !== undefined) {
          data = error.response.data
        }
        reject(data)
      })
  })
}

const axiosDelete = (url, header = {}, config = {}) => {
  return new Promise((resolve, reject) => {
    setHeader(header)
    axios({
      method: 'delete',
      url: url,
      config: config
    })
      .then(({data}) => {
        resolve(data)
      })
      .catch(error => {
        let data = error
        if (error.response !== undefined) {
          data = error.response.data
        }
        reject(data)
      })
  })
}

export { setHeader, axiosGet, axiosPost, axiosPut, axiosDelete }