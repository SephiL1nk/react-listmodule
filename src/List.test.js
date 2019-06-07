import { shallow } from 'enzyme'
import ListEnhanced from './List'
import React from 'react'
import mockAxios from 'axios'

describe('Testing List behavior', () => {
  test('Is Api get function called at init', () => {
    let props = {}
    const wrapper = shallow(<ListEnhanced {...props}/>)
    const instance = wrapper.instance()
    const spy = jest.spyOn(instance, 'getDataFromApi')
    instance.componentDidMount()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('No Api url and header are given, should return Error message', () => {
    let props = {}
    const wrapper = shallow(<ListEnhanced {...props} />)
    const instance = wrapper.instance()
    instance.getDataFromApi()
    .catch(response => {
      expect(response).toBe('No API nor Header in your configuration')
    })
  })
})