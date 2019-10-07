import React from "react";
import {CircularProgress, Grid} from "@material-ui/core";

const Loader = () => {
    return (
        <React.Fragment>
            <Grid
                style={{minHeight: "100vh"}}
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <CircularProgress size={50}/>
            </Grid>
        </React.Fragment>
    );
};
export default Loader;
