import React, { Component } from 'react'
import _ from 'lodash'
import { TablePagination, TableFooter, TableRow } from '@material-ui/core'

class Pagination extends Component {
  //Constructor Init
  constructor() {
    super()
    this.state = {}
  }

  onPageChange = (event) => {

  }

  onItemPerRowsChange = (event) => {

  }

  render() {
    const { rowsPerPageOptions, rowsPerPage, rows, page, total } = this.props
    return (
      <React.Fragment>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={rowsPerPageOptions}
              colSpan={3}
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'Rows per page' },
                native: true,
              }}
              onChangePage={() => this.onPageChange}
              onChangeRowsPerPage={() => this.onItemPerRowChange}
            />
          </TableRow>
        </TableFooter>      
      </React.Fragment>
    )
  }
}

Pagination.defaultProps = {
  rowsPerPageOptions: [10,20,30],
  rowsPerPage: 10,
  page: 0
}

export default Pagination