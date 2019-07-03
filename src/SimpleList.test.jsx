jest.unmock('axios')
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { shallow, mount } from 'enzyme'
import SimpleList from './SimpleList'
import React from 'react'
import { api, apiResponse } from '../__fixtures__/listApiResponse.js'

var mock = new MockAdapter(axios)

describe('Test if the SimpleList functions are OK : ', () => {
  test('should call API on component mount', () => {
    let props = {}

    const wrapper = shallow(<SimpleList {...props} />)
    const instance = wrapper.instance()

    const spy = jest.spyOn(instance, 'getDataFromApi')
    instance.componentDidMount()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('Should be 200 if getDataFromApi have api props configured', async () => {
    let props = { api }
    mock.onGet(api.url).reply(200, {
      apiResponse
    })

    const wrapper = mount(<SimpleList {...props} />)
    const instance = wrapper.instance()

    await instance.getDataFromApi()
    console.log(wrapper.props(), wrapper.state())
    console.log(wrapper.dive().find('.item-list').text())

  })
})