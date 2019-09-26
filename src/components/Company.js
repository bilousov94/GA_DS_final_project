import React, { useContext } from 'react';


import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';


import { makeStyles, withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Fade from '@material-ui/core/Fade';

import ValueLabel from "@material-ui/core/Slider/ValueLabel";

//Context
import { AppContext } from '../App';

const useStyles = makeStyles(theme => ({
    main: {
        position: 'relative',
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
        marginBottom: theme.spacing(4),
        borderRadius: '4px',
        backgroundImage: 'url(https://panamaadvisoryinternationalgroup.com/blog/wp-content/uploads/2013/06/Forex-Chart-4.jpeg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundBlendMode: 'multiply'
    },

    button: {
        backgroundColor: '#fafafa',
        marginLeft: '20px',
        marginBottom: '20px',
        "&:hover": {
            background: "#d5d5d5"
        },

    },
    root: {
        width: 300,
        margin: '30px',
        color: '#ffffff'
    },


    markLabelActive: {
        color: '#f41f69',
        fontSize: '1rem',
        fontWeight: 'bolder',
        marginLeft: '25px'
    }
}));

const StyledValueLabel = withStyles({
    offset: {
        top: -40,
        left: () => "calc(-50% + -12px)"
    },
    circle: {
        width: '3rem',
        height: '3rem',
    },
})(ValueLabel);

export default function Company() {
    const classes = useStyles();
    const {state, dispatch} = useContext(AppContext);

    const [anchorEl, setAnchorEl] = React.useState(null);

    let maxValue = (state.maxHistoryYear - state.minHistoryYear)*2 + 1;

    const [value, setValue] = React.useState([1, maxValue]);

    const marks = [
        {
            value: 1,
            label: `${state.minHistoryYear}-01`,
        },
        {
            value: maxValue,
            label: `${state.maxHistoryYear}-01`,
        },
    ];

    const year_label = (value) => {
        let year = Number(marks[0].label.substring(0, 4)) + (Math.ceil(value/2) - 1);
        let month = (value%2) ? '01' : '06';
        return `${year}-${month}`;
    };

    //Change date range
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Open drop down menu for models
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    // Select exact model
    const handleClose = (model) => {
        setAnchorEl(null);

        //Create start date
        let startYear = Number(marks[0].label.substring(0, 4)) + (Math.ceil(value[0]/2) - 1);
        let startMonth = (value[0]%2) ? '01' : '06';
        let startDate = `${startYear}-${startMonth}-01`;

        //Create end date
        let endYear = Number(marks[0].label.substring(0, 4)) + (Math.ceil(value[1]/2) - 1);
        let endMonth =  (value[1]%2) ? '01' : '06';
        let endDate = `${endYear}-${endMonth}-01`;

        dispatch({ type: 'SELECT_MODEL', model: model, startDate: startDate, endDate: endDate});
    };

    return(
        <Paper>
            <Fade in={true} timeout={{enter: 1000}}>
                <Typography className={classes.main} component="div">
                    <Box fontSize="h2.fontSize" m={3}>
                        {`${state.companyInfo.longName}, ${state.companyInfo.symbol}`}
                    </Box>
                    <Box fontWeight="fontWeightLight" style={{color: '#d4d4d4'}} fontSize="h4.fontSize" m={3}>
                        {`${state.companyInfo.fullExchangeName}: $${state.companyInfo.regularMarketPreviousClose}`}
                    </Box>

                    <div className={classes.root}>
                        <Typography id="range-slider" gutterBottom>
                            Train Data Range
                        </Typography>
                        <Slider
                            classes={{markLabelActive: classes.markLabelActive, markLabel: classes.markLabelActive}}

                            value={value}
                            color='secondary'
                            onChange={handleChange}
                            defaultValue={[1, maxValue]}
                            min={1}
                            max={maxValue}
                            valueLabelDisplay="auto"
                            valueLabelFormat={year_label}
                            ValueLabelComponent={StyledValueLabel}
                            aria-labelledby="range-slider"
                            marks={marks}
                        />
                    </div>
                    <div>
                        <Button aria-controls="simple-menu" aria-haspopup="true" className={classes.button} onClick={handleClick}>
                            Select Model
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={() => { handleClose(false) }}
                        >
                            <MenuItem onClick={() => { handleClose(1) }}>Prophet</MenuItem>
                        </Menu>
                    </div>
                </Typography>
            </Fade>
        </Paper>
    )
}