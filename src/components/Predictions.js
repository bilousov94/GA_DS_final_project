import React, { useContext, useState, useEffect } from 'react';
import {makeStyles} from "@material-ui/core/styles/index";

import Container from '@material-ui/core/Container';
//Elements
// import Link from '@material-ui/core/Link';
// import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
// import InputBase from '@material-ui/core/InputBase';
//
// //Icons
// import IconButton from '@material-ui/core/IconButton';
// import SearchIcon from '@material-ui/icons/Search';
//
// //Context
import { AppContext } from '../App'
import ZoomImg from './Zoomimg';

const useStyles = makeStyles(theme => ({
    mainMargin: {
        marginBottom: theme.spacing(4),

    },
}));

export default function Predictions() {
    const classes = useStyles();

    const {state, dispatch} = useContext(AppContext);
    // const [data, setData] = useState(false);

    return(
        <React.Fragment>
            <Paper className={classes.mainMargin}>
                <ZoomImg
                    src={`/test_prediction/${state.selectedTicker}`}
                />
            </Paper>
        </React.Fragment>
    )
}


