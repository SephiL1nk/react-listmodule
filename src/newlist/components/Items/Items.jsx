import React, { Component } from 'react'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import style from './style'

class Items extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <React.Fragment>
        <div>Items</div>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(Items)