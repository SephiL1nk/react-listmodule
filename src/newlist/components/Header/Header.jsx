import React, { PureComponent } from 'react'
import _ from 'lodash'
import { TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import style from './style'
import { withStyles } from '@material-ui/styles'
import Search from '../Search/Search'
import propTypes from 'prop-types'

class Header extends PureComponent {
  render() {
    const { header, showSearchBar, searchParams } = this.props
    
    return (
      <React.Fragment>
        <TableHead>
          <TableRow>
            {_.map(header, col => {
              return (
                  <TableCell key={`${col.id}-header`}>
                    {col.label}
                  </TableCell>
                )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
            {showSearchBar && _.map(header, col => {
              return (
                <TableCell key={`${col.id}-search`}>
                  <Search 
                      column={col} 
                      searchParams={searchParams}
                  />
                </TableCell>
              )
            })}
            </TableRow>
        </TableBody>
        
      </React.Fragment> 
    )
  }
}

Header.propTypes = {
  header: propTypes.arrayOf(propTypes.shape({
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
  })),
  showSearchBar: propTypes.bool.isRequired
}

Header.defaultProps = {
  header: [],
  showSearchBar: true
}

export default withStyles(style)(Header)