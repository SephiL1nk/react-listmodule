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

  test('Is displaying error message for no data', () => {
    let props = {}
    const component = renderer.create(<List  {...props} />)
    const root = component.root
    const noDataFound = root.findByProps({className: 'no-data-found'})
    expect(noDataFound.props.children).toBe('No data where available to display this component.')
  })

  test('Is displaying custom error message for no data', () => {
    let props = {
      messages: {
        nodata: 'no data'
      }
    }
    const component = renderer.create(<List  {...props} />)
    const root = component.root
    const noDataFound = root.findByProps({className: 'no-data-found'})
    expect(noDataFound.props.children).toBe('no data')
  })
})

