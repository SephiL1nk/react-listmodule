import React, { Component } from 'react'
import _ from 'lodash'
import { withStyles, TableBody, TableCell, TableRow } from '@material-ui/core'
import style from './style'

class Items extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {}
  }

  formatRender = (item, col) => {
    let defaultItem = _.get(item, col.id)
    let render  = _.isFunction(this.props.transformDataOnDisplay) ? this.props.transformDataOnDisplay(_.get(item, col.id), col.id) : _.get(item, col.id)

    if (_.isEqual(render, defaultItem) && (_.isArray(render) || _.isObject(render) || _.isUndefined(render))) {
      render = ``
    }

    if (col.id === 'actions') {
      render='actions'
    }

    return render
  }

  render() {
    const { items,header } = this.props
    console.log(items)
    return (
      <React.Fragment>
        <TableBody className='item-list' >
          { _.map(items, (item, index) => {
            return (<TableRow key={`${index}-itemrow`}>
              {_.map(header, (col, cellindex) => {
                const value = this.formatRender(item, col)
                
                return (
                  <TableCell key={`column${cellindex}-row${index}-itemcell`}>
                    {value}
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
  header: 0
}

export default withStyles(style)(Items)