import React, { useContext } from 'react';
import {makeStyles} from "@material-ui/core/styles/index";

import Paper from '@material-ui/core/Paper';
import ZoomImg from './Zoomimg';

 //Context
import { AppContext } from '../App'


const useStyles = makeStyles(theme => ({
    mainMargin: {
        marginBottom: theme.spacing(4),

    },
}));

export default function Predictions() {
    const classes = useStyles();

    const {state} = useContext(AppContext);

    return(
        <React.Fragment>
            <Paper className={classes.mainMargin}>
                <ZoomImg
                    src={`/prediction?ticker=${state.companyInfo.symbol}&start_date=${state.predictionStartDate}&end_date=${state.predictionEndDate}`}
                />
            </Paper>
        </React.Fragment>
    )
}


