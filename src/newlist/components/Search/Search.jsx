import React, { Component } from 'react'
import _ from 'lodash'
import { withStyles, TextField } from '@material-ui/core'
import style from './style'
import propTypes from 'prop-types'
class Search extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {
      value: ''
    }
  }

  onChange = (event, column) => {
    this.setState({value: event.target.value})
    //workaround for SyntheticEvent
    const eventValue = event.target.value
    this.props.searchParams({ [this.searchBy(column)]: eventValue })
  }

  searchBy = (column) => {
    let suffix = !_.isUndefined(_.get(column, 'search.suffix')) ? _.get(column, 'search.suffix') : ''
    let param = !_.isUndefined(_.get(column, 'search.by')) ? _.get(column, 'search.by') : column.id

    return `${param}${suffix}`
  }

  render() {
    const { column } = this.props
    return (
      <React.Fragment>
          <TextField
            id="outlined-email-input"
            label=''
            className={'searchbar'}
            type="email"
            name={column.label}
            margin="normal"
            variant="outlined"
            onChange={(e) => this.onChange(e, column)}
          />
      </React.Fragment>
    )
  }
}

Search.propTypes = {
  column: propTypes.object.isRequired,
  searchParams: propTypes.func.isRequired
}

Search.defaultProps = {
  column: {},
  searchParams: () => {}
}

export default withStyles(style)(Search)