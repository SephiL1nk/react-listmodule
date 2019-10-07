import React, { Component } from "react";
import { Card, CardContent, Grid } from "@material-ui/core";
import style from "./style";
import { withStyles } from "@material-ui/styles";

interface PropsCard {
  card: string;
}

interface Props {
  classes: PropsCard
}

class Error extends Component<Props, {}> {
  //Constructor Init
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          <Card className={classes.card}>
            <CardContent className="error-modal">An error occured.</CardContent>
          </Card>
        </Grid>
      </React.Fragment>
    );
  }
}
export default withStyles(style)(Error);
