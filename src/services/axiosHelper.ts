import axios from 'axios'
import _ from 'lodash'

const setHeader = (params: any = {}) => {
    if (params.common !== undefined) {
        _.map(params.common, (item, key) => {
            axios.defaults.headers.common[key] = item
        });
    }
};


const axiosGet = async (url: string, params = {}, header = {}) => {
    setHeader(header);
    return await axios.get(url, {params})
        .then((data: any) => {
            return ({data: data})
        })
        .catch((error: any) => {
            return ({error: error.response.data})
        });
};

export {setHeader, axiosGet}