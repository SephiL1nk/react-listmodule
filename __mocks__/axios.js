import {listCoupons} from '../__fixtures__/listApiResponse'

const mockAxios = {
  get: jest.fn((url, params, header) => {
    switch (url) {
      case "https://billypp.webcoupon.web.oxv.fr/api/coupons":
        return Promise.resolve({
          data: listCoupons
        })
    }
  })
}

module.exports = mockAxios