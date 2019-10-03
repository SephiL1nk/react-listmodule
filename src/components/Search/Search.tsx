import React, {Component} from "react";
import _ from "lodash";
import TextField from "@material-ui/core/TextField";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import has from "lodash/has";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';

export enum SearchTypeFormInput {
	INPUT = 'input',
	SELECT = 'select',
	DATE = 'date'
}

export interface SearchProps {
	column: {
		disablePadding?: boolean,
		id: string,
		label?: string,
		sortable?: boolean,
		search: {
			type?: SearchTypeFormInput,
			multiple?: boolean,
			suffix?: string,
			by?: string
			selectOptions?: {
				label: string
				value: string
			}[]
		},
		[key: string]: any
	},
	searchParams: (...args: any[]) => any
}

interface SearchState {
	value: string
}

class Search extends Component<SearchProps, SearchState> {
	static defaultProps = {
		column: {},
		searchParams: () => {
		}
	};

	private renderInputForm = {
		[SearchTypeFormInput.INPUT]: this.renderInputBasicForm.bind(this),
		[SearchTypeFormInput.SELECT]: this.renderInputSelectForm.bind(this),
		[SearchTypeFormInput.DATE]: this.renderInputDate.bind(this)
	};

	//Constructor Init
	constructor(props: SearchProps) {
		super(props);
		this.state = {
			value: ""
		};
	}

	onChange = (event: any, column: any) => {
		if (event instanceof Date) {
			const formatDate = (event.getMonth() + 1) + '/' + event.getDate() + '/' + event.getFullYear();
			this.search(column, formatDate);
		} else if (has(event, 'target') && has(event.target, 'value')) {
			this.search(column, event.target.value);
		} else {
			this.search(column, null);
		}
	};

	private search(column: any, value: any = null) {
		this.setState({value: value});
		this.props.searchParams({[this.searchBy(column)]: value});
	}

	searchBy = (column: any) => {
		let suffix = !_.isUndefined(_.get(column, "search.suffix"))
			? _.get(column, "search.suffix")
			: "";
		let param = !_.isUndefined(_.get(column, "search.by"))
			? _.get(column, "search.by")
			: column.id;
		return `${param}${suffix}`;
	};

	render() {
		const {column} = this.props;
		const inputType = column.search && column.search.type ? column.search.type : SearchTypeFormInput.INPUT;
		const inputRender = this.renderInputForm[inputType](column);
		return (
			<React.Fragment>
				{inputRender}
			</React.Fragment>
		);
	}

	private renderInputBasicForm(column: any) {
		return (
			<TextField
				className={"searchbar"}
				type="text"
				name={column.label}
				margin="normal"
				variant="outlined"
				onChange={e => this.onChange(e, column)}
			/>
		);
	}

	private renderInputSelectForm(column: SearchProps['column']) {
		if (!has(column.search, 'selectOptions')) {
			console.error('selectOptions not define but you use select input please define selectOptions');
			return null;
		}
		const options = column.search.selectOptions ? column.search.selectOptions : [];
		return (
			<Select
				onChange={e => this.onChange(e, column)}
			>
				{options.map((selectOptions: { label: string, value: string }) =>
					<MenuItem value={selectOptions.value}>{selectOptions.label}</MenuItem>)
				}
			</Select>
		);
	}

	private renderInputDate(column: any) {
		return (
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<KeyboardDatePicker
					autoOk
					value={this.state.value}
					format="dd/MM/yyyy"
					margin="normal"
					id="date-picker-dialog"
					onChange={(e: any) => this.onChange(e, column)}
					KeyboardButtonProps={{
						'aria-label': 'change date',
					}}
					invalidDateMessage={null}
				/>
			</MuiPickersUtilsProvider>
		)
	}
}

export default Search;
