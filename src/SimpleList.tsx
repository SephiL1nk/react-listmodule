import React, {Component} from "react";
import Header from "./components/Header/Header";
import Items from "./components/Items/Items";
import Pagination from "./components/Pagination/Pagination";
import _ from "lodash";
import Error from "./components/Error/Error";
import {axiosGet} from "./services/axiosHelper";
import Loader from "./components/Loader/Loader";
import {Table} from "@material-ui/core";
import {
	deleteEmptyKeys,
	filterObjectKeyByRegex,
	filterByRegex
} from "./services/manager";

interface SimpleListProps {
	header: any[],
	messages?: {
		nodata?: string,
		apiError?: string
	},
	api: {
		url: string,
		header?: any,
		filter?: any
	},
	pagination: {
		rowsPerPageKey: string,
		pageKey: string,
		dataKey?: string,
		totalItemsKey?: string,
		totalItems?: number,
		rowsPerPage?: number,
		rowsPerPageOptions?: any[],
		rowsPerPageText?: string,
		labelRowsPerPage?: string,
		labelDisplayedRows?({from, to, count}: any): any,
	},
	showSearchBar?: boolean,
	refresh?: boolean,
	transformDataOnFetch?: (...args: any[]) => any,
	actions?: (...args: any[]) => any,
	transformDataOnDisplay: () => any,
	timerSearch: any
}

interface SimpleListState {
	rowsPerPage: any | number,
	dataKey: any | string,
	totalItemsKey: any | string,
	filter: any | {},
	error: any,
	items: any[],
	page: number,
	total: number,
	loading: boolean,
	order: string,
	orderBy: string,
	search: any
}

class SimpleList extends Component<SimpleListProps, SimpleListState> {
	static defaultProps: Partial<SimpleListProps> = {
		actions: () => {
		},
		showSearchBar: true,
		refresh: false,
		transformDataOnFetch: (data: any) => data,
		timerSearch: 1000
	};
	toBecalledOnce: any;

	//Constructor Init
	constructor(props: SimpleListProps) {
		super(props);
		this.state = {
			error: {},
			items: [],
			page: 0,
			rowsPerPage: 10,
			total: 0,
			loading: true,
			order: "",
			orderBy: "",
			dataKey: "",
			totalItemsKey: "",
			search: {},
			filter: {}
		};
	}

	componentDidMount() {
		const {pagination, api} = this.props;
		const rowsPerPage = pagination && pagination.rowsPerPage;
		const dataKey = pagination && pagination.dataKey;
		const totalItemsKey = pagination && pagination.totalItemsKey;
		const filter = api && api.filter;
		this.setState(
				{
					rowsPerPage: rowsPerPage,
					dataKey: dataKey,
					totalItemsKey: totalItemsKey,
					filter: {...filter}
				},
				() => this.getDataFromApi()
		);
	}

	componentDidUpdate(prevProps: any) {
		if (this.props.refresh !== prevProps.refresh) {
			this.getDataFromApi();
		}
	}

	getDataFromApi = async () => {
		let {url, header} = this.props.api;
		const {dataKey, totalItemsKey} = this.state;
		if (_.isEmpty(this.state.items)) {
			this.setState({loading: true});
		}
		let requestParams = this.getSearchParams();
		await axiosGet(url, requestParams, header).then(({data, error}: any) => {
			let transformData = this.props.transformDataOnFetch ? this.props.transformDataOnFetch(
					_.get(data, dataKey, data)
			) : undefined;
			let totalItems = _.get(data, totalItemsKey);
			this.setState({items: transformData, error: error, total: totalItems});
		});
		this.setState({loading: false});
	};
	/**
	 * Create an object with all parameters needed to perform a search :
	 * Is called before every API call
	 * rowsPerPageKey (should be in sync with the rowsPerPage option)
	 * Page (needed page)
	 * Search parameters from the search bar if there is one
	 * Orderby (should be on one column if it is)
	 *
	 */
	getSearchParams = () => {
		const {pagination} = this.props;
		const {rowsPerPage, search, page, filter} = this.state;
		let paginateOptions = {
			[pagination.rowsPerPageKey]: rowsPerPage,
			[pagination.pageKey]: page + 1
		};
		const params = {
			...filter,
			...search,
			...paginateOptions
		};
		return params;
	};
	/**
	 * Launch search in current items fetched from the last api call.
	 * Filter toLowerCase the search params and the item value targeted to be case insensitive
	 * Use the current input used by the user to filter the results
	 */
	searchInCurrentData = (param: any) => {
		let regex = /^[\w]+/;
		//Filter params to match the current columns, and avoid the [gte]|[lte] and so on.
		let filterParam: any = filterObjectKeyByRegex(param, regex);
		let searchKey = Object.keys(filterParam)[0];
		//construct the regexp used to search keywords form the search
		const searchRegex = new RegExp(`^${filterParam[searchKey]}`, "igm");
		let {items} = this.state;
		let filteredItems = _.filter(items, item => {
			//get the value to filter from the Item
			let valueToFilter =
					!_.isNil(_.get(item, searchKey)) &&
					_.get(item, searchKey)
							.toString()
							.toLowerCase();
			return valueToFilter && filterByRegex(valueToFilter, searchRegex) && item;
		});
		this.setState({items: filteredItems});
	};
	/**
	 * Performed right after a search
	 * It set the new search state (params to search for)
	 * Then search in current datas from the last api call
	 * Then after a timerSearch timeout, search from the real API. Timer is cleared every times the user make a search input
	 * To avoid re-rendering in the middle of the
	 */
	searchParams = (currentSearchParam: any) => {
		let {timerSearch} = this.props;
		//set new params and concatenate
		let {search} = this.state;
		let newParams = deleteEmptyKeys({...search, ...currentSearchParam});
		this.setState({search: newParams, page: 0}, () =>
				this.searchInCurrentData(currentSearchParam)
		);
		//After timerSearch (int), will call the API
		let duration = parseInt(timerSearch);
		clearTimeout(this.toBecalledOnce);
		this.toBecalledOnce = setTimeout(() => {
			this.getDataFromApi();
		}, duration);
	};
	onChangePage = (event: any, page: number) => {
		this.setState({page}, () => this.getDataFromApi());
	};
	onChangeRowsPerPage = (event: any) => {
		this.setState({rowsPerPage: event.target.value, page: 0}, () =>
				this.getDataFromApi()
		);
	};

	render() {
		const {items, error, loading, rowsPerPage, total, page} = this.state;
		const {
			header,
			transformDataOnDisplay,
			showSearchBar,
			pagination,
			actions
		} = this.props;
		return (
				<React.Fragment key="list-simple">
					<Table>
						<Header
								header={header}
								showSearchBar={showSearchBar}
								searchParams={this.searchParams}
						/>
						<React.Fragment>
							{loading ? (
									<Loader/>
							) : !_.isEmpty(error) ? (
									<Error/>
							) : (
									<Items
											items={items}
											header={header}
											transformDataOnDisplay={transformDataOnDisplay}
											actions={actions}
									/>
							)}
						</React.Fragment>
						<Pagination
								total={total}
								page={page}
								rowsPerPageOptions={pagination ? pagination.rowsPerPageOptions : undefined}
								rowsPerPage={rowsPerPage}
								onChangePage={this.onChangePage}
								onChangeRowsPerPage={this.onChangeRowsPerPage}
								labelRowsPerPage={pagination ? pagination.labelRowsPerPage : undefined}
								labelDisplayedRows={pagination ? pagination.labelDisplayedRows : undefined}
						/>
					</Table>
				</React.Fragment>
		);
	}
}

export default SimpleList;
