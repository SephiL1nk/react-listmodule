import React, { Component } from "react";
import _ from "lodash";
import { TableBody, TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import style from "./style";

interface Props {
  items: any,
  header: any,
  actions(): any,
  classes?: any
  transformDataOnDisplay?(): any
}

class Items extends Component<Props, any> {
  static defaultProps = {
    items: {},
    header: 0,
    actions: () => {}
  };
  //Constructor Init
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  formatRender = (item: any, col: any) => {
    const value = _.get(item, col.id);
    return _.isArray(value) ||
      _.isObject(value) ||
      _.isNil(value) ||
      _.isNaN(value)
      ? ""
      : value;
  };
  render() {
    const { items, header, actions, classes } = this.props;
    return (
      <React.Fragment>
        <TableBody className="item-list">
          {_.map(items, (item: any, index: any) => {
            return (
              <TableRow
                key={`${index}-itemrow`}
                classes={{
                  root: index % 2 !== 0 ? classes.oddRow : classes.evenRow
                }}
              >
                {_.map(header, (col: any, cellIndex: number) => {
                  const value = this.formatRender(item, col);
                  return (
                    <TableCell key={`column${cellIndex}-row${index}-itemcell`}>
                      {col.id === "actions" && _.isFunction(actions)
                        ? actions(item)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </React.Fragment>
    );
  }
}

export default withStyles(style)(Items);
