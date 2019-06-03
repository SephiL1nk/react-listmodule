import React from 'react'
import List from './index.js'
import renderer from 'react-test-renderer'

describe('Snapshot testing and is everything rendering ', () => {
  test('Is snapshot the same', () => {
    const component = renderer.create(<List props={null} />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  // test('Is hello world the text showing in front', () => {
  //   const component = renderer.create(<List />)
  //   const root = component.root
  //   const title = root.findByProps({ className: 'title' })

  //   expect(title.props.children).toBe('Hello world')
  // })
})
