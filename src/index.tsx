import SimpleList from './SimpleList'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import React, {Component} from 'react'

const theme = createMuiTheme({});

class List extends Component {
    render() {
        return (
            <React.Fragment>
                <MuiThemeProvider theme={theme}>
                    <SimpleList {...this.props} />
                </MuiThemeProvider>
            </React.Fragment>
        )
    }
}

export default List