import ListEnhanced from './List'
import { render } from 'react-dom'

import React, { Component } from 'react'

class List extends Component {
  render() {
    return (
      <React.Fragment>
        <ListEnhanced {...this.props} />   
      </React.Fragment>
    )
  }
}

render(<List />, document.getElementById('app'));
