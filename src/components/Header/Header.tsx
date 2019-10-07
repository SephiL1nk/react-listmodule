import React, {PureComponent} from 'react';
import _ from 'lodash';
import {TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import style from './style';
import {withStyles} from '@material-ui/styles';
import Search from '../Search/Search';

interface HeaderProps {
	header?: {
		id: string,
		numeric?: boolean,
		sortable?: boolean,
		label: string,
		search?: {
			type?: string,
			suffix?: string,
			multiple?: boolean,
			by?: string
		}
	}[],
	showSearchBar: boolean
	classes?: {
		searchInputsTable: string
	}
	searchParams: any
}

class Header extends PureComponent<HeaderProps, {}> {
	static defaultProps = {
		header: [],
		showSearchBar: true
	};

	render() {
		const {header, showSearchBar, searchParams, classes} = this.props;
		return (
			<React.Fragment>
				<TableHead>
					<TableRow>
						{_.map(header, col => {
							return (
								<TableCell key={`${col.id}-header`}>{col.label}</TableCell>
							);
						})}
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						{showSearchBar &&
						_.map(header, col => {
							return (
								<TableCell
									key={`${col.id}-search`}
									className={classes ? classes.searchInputsTable : ''}
								>
									{col.id !== "actions" && (
										<Search column={col as any} searchParams={searchParams}/>
									)}
								</TableCell>
							);
						})}
					</TableRow>
				</TableBody>
			</React.Fragment>
		);
	}
}

export default withStyles(style)(Header);
