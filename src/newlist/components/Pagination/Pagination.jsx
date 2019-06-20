import React, { Component } from 'react'
import _ from 'lodash'
import { TablePagination, TableFooter, TableRow, TableBody } from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import { paginationActions } from './style'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'

class Pagination extends Component {
  //Constructor Init
  constructor() {
    super()
  }

  handleFirstPageButtonClick = (event) => {
    this.props.onChangePage(event, 0)
  }

  handleBackButtonClick = (event, page) => {
    this.props.onChangePage(event, page - 1)
  }

  handleNextButtonClick = (event, page) => {
    this.props.onChangePage(event, page + 1)
  }

  handleLastPageButtonClick = (event, total, rowsPerPage) => {
    this.props.onChangePage(event, Math.max(0, Math.ceil(total / rowsPerPage) - 1))
  }

  render() {
    const { rowsPerPageOptions, rowsPerPage, page, total, onChangeRowsPerPage, classes, labelRowsPerPage, labelDisplayedRows } = this.props

    const PaginationActions = () => {
      return (
        <div className={`${classes.pagination}`}>
          <IconButton
            onClick={(e) => this.handleFirstPageButtonClick(e)}
            disabled={page === 0}
            aria-label="First Page"
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton onClick={(e) => this.handleBackButtonClick(e, page)} disabled={page === 0} aria-label="Previous Page">
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={(e) => this.handleNextButtonClick(e, page)}
            disabled={page >= Math.ceil(total / rowsPerPage) - 1}
            aria-label="Next Page"
          >
            <KeyboardArrowRight />
          </IconButton>
          <IconButton
            onClick={(e) => this.handleLastPageButtonClick(e, total, rowsPerPage)}
            disabled={page >= Math.ceil(total / rowsPerPage) - 1}
            aria-label="Last Page"
          >
            <LastPageIcon />
          </IconButton>
        </div>
      )
    }

    return (
      <React.Fragment>
        <TableBody>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              count={total}
              rowsPerPage={parseInt(rowsPerPage)}
              page={page}
              labelRowsPerPage={labelRowsPerPage}
              labelDisplayedRows={labelDisplayedRows}
              onChangePage={(e) => {}}
              onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
              ActionsComponent={PaginationActions}
            />
        </TableBody>      
      </React.Fragment>
    )
  }
}

Pagination.defaultProps = {
  rowsPerPageOptions: [10,20,30],
  rowsPerPage: 10,
  page: 0,
  labelRowsPerPage: 'Rows per page',
  labelDisplayedRows: ({from, to, count}) => `${from}-${to} of ${count}`
}

export default withStyles(paginationActions)(Pagination)