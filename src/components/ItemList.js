import React, { Component } from 'react'
import _ from 'lodash'
import { TableBody, TableCell, TableRow } from '@material-ui/core'
import { isFunction } from '../services/objectHelper'

export default class ItemList extends Component {
  constructor() {
    super()
  }

  render() {
    let { data, header, total } = this.props
    if (total && total !== 0) {
      return (
        <React.Fragment>
          <TableBody> 
            {data && !_.isEmpty(data) && _.map(data, (item) => 
             
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={item.id}
                style={item.style}
              >
                {header.map((column) => {
                  if (column.id === 'actions' && isFunction(this.props.actionListFunction)) {
                    return <TableCell>{this.props.actionListFunction(item)}</TableCell>
                  } else {
                    let display = isFunction(this.props.transformDataOnDisplay) ? this.props.transformDataOnDisplay(_.get(item, column.id), column.id) : _.get(item, column.id)
                    return <TableCell>{display}</TableCell>
                  }
                })}
  
              </TableRow>
            )}
          </TableBody>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <TableBody> 
            <TableRow>
              <div className='no-data-found'>No data found for this research, sorry</div>
            </TableRow>
          </TableBody>
        </React.Fragment>
      )
    }
  }
}