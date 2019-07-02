import SimpleList from './newlist/SimpleList'
import React, { Component } from 'react'

class List extends Component {
  render() {
    return (
      <React.Fragment>
          <SimpleList {...this.props} />
      </React.Fragment>
    )
  }
}

export default List