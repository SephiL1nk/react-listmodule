import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/styles'
import style from './style'
import _ from 'lodash'

class ModalError extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
  }

  componentDidMount() {
    this.setState({open: this.props.open})
  }

  handleClose = () => {
    this.setState({open: false})
  }

  render() {
    console.log(this.props)
    const { classes, messages } = this.props
    const { open } = this.state
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={() => this.handleClose()}
        >
          <div className={classes.paper}>
            <Typography variant="subtitle1" id="simple-modal-description">
              {!_.isUndefined(_.get(messages, 'apierror')) && messages.apierror}
            </Typography>
          </div>
        </Modal>
      </div>
    )
  }
}

export default withStyles(style)(ModalError)