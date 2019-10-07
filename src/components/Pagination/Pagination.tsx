import React, {Component} from "react";
import {TablePagination, TableBody} from "@material-ui/core";
import {withStyles} from "@material-ui/styles";
import {paginationActions} from "./style";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

interface Props {
    rowsPerPageOptions: number[],
    rowsPerPage: number,
    page: number,
    total: number,
    labelRowsPerPage?: string,
    labelDisplayedRows?({from, to, count}: any): any,
    onChangeRowsPerPage(event: any): any,
    onChangePage(event: any, page: number): any
    classes: any
}

class Pagination extends Component<Props, {}> {
    static defaultProps = {
        rowsPerPageOptions: [10, 20, 30],
        rowsPerPage: 10,
        page: 0,
        labelRowsPerPage: "Rows per page",
        labelDisplayedRows: ({from, to, count}: any) => `${from}-${to} of ${count}`
    };

    handleFirstPageButtonClick = (event: any) => {
        this.props.onChangePage(event, 0);
    };
    handleBackButtonClick = (event: any, page: number) => {
        this.props.onChangePage(event, page - 1);
    };
    handleNextButtonClick = (event: any, page: number) => {
        this.props.onChangePage(event, page + 1);
    };
    handleLastPageButtonClick = (event: any, total: number, rowsPerPage: number) => {
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(total / rowsPerPage) - 1)
        );
    };

    render() {
        const {
            rowsPerPageOptions,
            rowsPerPage,
            page,
            total,
            onChangeRowsPerPage,
            classes,
            labelRowsPerPage,
            labelDisplayedRows
        } = this.props;
        const PaginationActions = () => {
            return (
                <div className={`${classes.pagination}`}>
                    <IconButton
                        onClick={e => this.handleFirstPageButtonClick(e)}
                        disabled={page === 0}
                        aria-label="First Page"
                    >
                        <FirstPageIcon/>
                    </IconButton>
                    <IconButton
                        onClick={e => this.handleBackButtonClick(e, page)}
                        disabled={page === 0}
                        aria-label="Previous Page"
                    >
                        <KeyboardArrowLeft/>
                    </IconButton>
                    <IconButton
                        onClick={e => this.handleNextButtonClick(e, page)}
                        disabled={page >= Math.ceil(total / rowsPerPage) - 1}
                        aria-label="Next Page"
                    >
                        <KeyboardArrowRight/>
                    </IconButton>
                    <IconButton
                        onClick={e => this.handleLastPageButtonClick(e, total, rowsPerPage)}
                        disabled={page >= Math.ceil(total / rowsPerPage) - 1}
                        aria-label="Last Page"
                    >
                        <LastPageIcon/>
                    </IconButton>
                </div>
            );
        };
        return (
            <React.Fragment>
                <TableBody>
                    <TablePagination
                        rowsPerPageOptions={rowsPerPageOptions}
                        count={total}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        labelRowsPerPage={labelRowsPerPage}
                        labelDisplayedRows={labelDisplayedRows}
                        onChangePage={e => {
                        }}
                        onChangeRowsPerPage={e => onChangeRowsPerPage(e)}
                        ActionsComponent={PaginationActions}
                    />
                </TableBody>
            </React.Fragment>
        );
    }
}

export default withStyles(paginationActions)(Pagination);
