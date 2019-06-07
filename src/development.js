import ListEnhanced from './List'
import { render } from 'react-dom'
import { api, header, datas } from '../__fixtures__/listApiResponse'
import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'

const props = {
  api, 
  header
}

class List extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <ListEnhanced {...props} />   
      </MuiThemeProvider>
      )
  }
}

render(<List />, document.getElementById('app'));
