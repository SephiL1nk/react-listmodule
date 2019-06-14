import React, { Component } from 'react'
import _ from 'lodash'
import { Card, CardContent, Grid, withStyles } from '@material-ui/core'
import style from './style'

class Error extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {}
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
        >
          <Card className={classes.card} >
            <CardContent className='error-modal'>
              An error occured.
            </CardContent>
          </Card>
        </Grid>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(Error)