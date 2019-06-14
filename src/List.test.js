import { shallow } from 'enzyme'
import ListEnhanced from './List'
import React from 'react'
import mockAxios from 'axios'
import { api } from '../__fixtures__/listApiResponse'

// describe('Testing List behavior', () => {
//   test('Is Api get function called at init', () => {
//     let props = {}
//     const wrapper = shallow(<ListEnhanced {...props}/>)
//     const instance = wrapper.instance()
//     const spy = jest.spyOn(instance, 'getDataFromApi')
//     instance.componentDidMount()
//     expect(spy).toHaveBeenCalledTimes(1)
//   })

//   test('No Api url and header are given, should return Error message', () => {
//     let props = {}
//     const wrapper = shallow(<ListEnhanced {...props} />)
//     const instance = wrapper.instance()
//     instance.getDataFromApi()
//     .catch(response => {
//       expect(response).toBe('No API nor Header in your configuration')
//     })
//   })


//   test('Api url and header are provided, should return a list of datas', async () => {
//     let props = {api}
//     console.log(props)
//     const wrapper = shallow(<ListEnhanced {...props} />)
//     const instance = wrapper.instance()
//     console.log(instance.getDataFromApi())
//   })
// })