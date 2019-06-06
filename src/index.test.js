import React from 'react'
import List from './index.js'
import renderer from 'react-test-renderer'

describe('Snapshot testing and is everything rendering ', () => {
  const props = {}

  test('Is snapshot the same', () => {
    const component = renderer.create(<List {...props}/>)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('Is displaying error message for no data', () => {
    const component = renderer.create(<List  {...props} />)
    const root = component.root
    const noDataFound = root.findByProps({className: 'no-data-found'})
    expect(noDataFound.props.children).toBe('No data found for this research, sorry')
  })


  // test('Is hello world the text showing in front', () => {
  //   const component = renderer.create(<List />)
  //   const root = component.root
  //   const title = root.findByProps({ className: 'title' })

  //   expect(title.props.children).toBe('Hello world')
  // })
})
