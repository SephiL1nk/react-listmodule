import React, { Component } from 'react'
import _ from 'lodash'
import { withStyles, TableHead, TableRow, TableCell } from '@material-ui/core'
import style from './style'
import Search from '../Search/Search'
import propTypes from 'prop-types'

class Header extends Component {
  //Constructor Init
  constructor() {
    super()
  }

  render() {
    const { header } = this.props
    console.log(header)
    
    return (
      <React.Fragment>
        <TableHead>
          <TableRow>
            {!_.isEmpty(header) && _.map(header, col => {
              return (
                <TableCell>{col.label}</TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <Search />
      </React.Fragment> 
    )
  }
}

Header.propTypes = {
  header: propTypes.shape({
    id: propTypes.string.isRequired,
    numeric: propTypes.bool,
    sortable: propTypes.bool,
    label: propTypes.string.isRequired,
    search: propTypes.shape({
      type: propTypes.string,
      suffix: propTypes.string,
      multiple: propTypes.bool,
      by: propTypes.string
    })
  }),
}


export default withStyles(style)(Header)