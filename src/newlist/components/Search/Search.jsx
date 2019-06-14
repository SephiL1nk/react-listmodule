import React, { Component } from 'react'
import _ from 'lodash'
import { withStyles, TableRow, TableCell, TableBody } from '@material-ui/core'
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
        <TableBody>
          <TableRow><TableCell>Search</TableCell></TableRow>
        </TableBody>  
      </React.Fragment>
    )
  }
}

export default withStyles(style)(Search)