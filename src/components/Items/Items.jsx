import React, { Component } from 'react'
import _ from 'lodash'
import { TableBody, TableCell, TableRow } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import style from './style'

class Items extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {}
  }

  formatRender = (item, col) => {
    const value = _.get(item, col.id)
    return (_.isArray(value) || _.isObject(value) || _.isNil(value) || _.isNaN(value)) ? '' : value
  }

  render() {
    const { items, header, actions, classes } = this.props
    return (
      <React.Fragment>
        <TableBody className='item-list' >
          { _.map(items, (item, index) => {
            return (
              <TableRow 
                key={`${index}-itemrow`}
                classes={{
                  'root': index % 2 !== 0 ? classes.oddRow : classes.evenRow
                }}
              >
              {_.map(header, (col, cellindex) => {
                const value = this.formatRender(item, col)
                  return (
                    <TableCell key={`column${cellindex}-row${index}-itemcell`}>
                      {col.id === 'actions' && _.isFunction(actions) ? actions(item) : value}
                    </TableCell>
                  )
              })}
          </TableRow>)
          })}
        </TableBody>
      </React.Fragment>
    )
  }
}

Items.defaultProps = {
  items: {},
  header: 0,
  actions: () => {}
}

export default withStyles(style)(Items)