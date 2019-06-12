import React, { Component } from 'react'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import style from './style'

class Search extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <React.Fragment>
        <div>Search</div>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(Search)