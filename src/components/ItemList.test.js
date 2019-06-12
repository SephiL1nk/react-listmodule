import { shallow } from 'enzyme'
import ItemList from './ItemList'
import React from 'react'
import { TableRow } from '@material-ui/core'
import { header, listCoupons } from '../../__fixtures__/listApiResponse'

describe('Testing itemList rendering' , () => {
  test('It renders nothing if props aren\'t passed to it', () => {
    let props = {}
    const wrapper = shallow(<ItemList {...props}/>)
    const instance = wrapper
    expect(wrapper.find('.no-data-found').length).toBe(10)
  })

  test('It renders a table with datas if there is a header and datas', () => {
    let props = {
      header, 
      data: listCoupons
    }
    const wrapper = shallow(<ItemList {...props}/>)
    const instance = wrapper
    expect(wrapper.find('.item-list-data-table').length).toBe(10)
  })
})
