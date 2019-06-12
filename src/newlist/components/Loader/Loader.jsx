import React, { Component } from 'react'
import { CircularProgress, Grid } from '@material-ui/core'
import _ from 'lodash'

class Loader extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <React.Fragment>
        <Grid
        style={{ minHeight: '100vh' }}
        container
        direction="row"
        justify="center"
        alignItems="center"
        >
          <CircularProgress size={50} />
        </Grid>
      </React.Fragment>
    )
  }
}

export default Loader