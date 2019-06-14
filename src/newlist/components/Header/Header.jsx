import React, { PureComponent } from 'react'
import _ from 'lodash'
import { withStyles, TableHead, TableRow, TableCell } from '@material-ui/core'
import style from './style'
import Search from '../Search/Search'
import propTypes from 'prop-types'

class Header extends PureComponent {
  //Constructor Init
  constructor() {
    super()
  }

  render() {
    const { header } = this.props
    
    return (
      <React.Fragment>
        <TableHead>
          <TableRow>
            {_.map(header, (col, index) => {
              return (
                <TableCell key={`${col.id}-header`}>{col.label}</TableCell>
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
}

Header.defaultProps = {
  header: []
}

export default withStyles(style)(Header)