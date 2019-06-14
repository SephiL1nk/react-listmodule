import React, { Component } from 'react'
import _ from 'lodash'
import { TableBody, TableCell, TableRow } from '@material-ui/core'
import { isFunction } from '../services/objectHelper'

export default class ItemList extends Component {
  constructor() {
    super()
  }

  render() {
    let { data, header } = this.props
    return (
      <React.Fragment>
        <TableBody> 
          {data && !_.isEmpty(data) && !_.isEmpty(header) && _.map(data, (item) => 
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={item.id}
              style={item.style}
              className="item-list-data-table"
            >
              {_.map(header, (column) => {
                if (column.id === 'actions' && isFunction(this.props.actionListFunction)) {
                  return <TableCell>{this.props.actionListFunction(item)}</TableCell>
                } else {
                  let display = isFunction(this.props.transformDataOnDisplay) ? this.props.transformDataOnDisplay(_.get(item, column.id), column.id) : _.get(item, column.id)
                  return <TableCell>{!_.isObject(display) && !_.isArray(display) && display}</TableCell>
                }
              })}
            </TableRow>
          )}

          {_.isEmpty(data) && _.times(10, (index) => {
            return (<TableRow
              hover
              role="checkbox"
              key={index}
              className="no-data-found"
            >
              {_.map(header, (col) => {
                return (<TableCell></TableCell>)
              })}
            </TableRow>)
          })}
        </TableBody>
      </React.Fragment>
    )
  }
}