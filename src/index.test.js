import React from 'react'
import List from './index.js'
import renderer from 'react-test-renderer'

describe('Snapshot testing and is everything rendering ', () => {
  test('Is snapshot the same', () => {
    let props = {}
    const component = renderer.create(<List {...props}/>)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})

