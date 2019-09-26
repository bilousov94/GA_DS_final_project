import React, { useContext } from 'react';
import {makeStyles, useTheme} from "@material-ui/core/styles/index";

//Elements
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';

//Icons
import FolderIcon from '@material-ui/icons/Folder';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

//Context
import { AppContext } from '../App'

const useStyles = makeStyles(theme => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },

    //List of stocks
    rootList: {
        flexGrow: 1,
        maxWidth: 752,
    },

    listItem: {
        border: '1px solid #c8c8c8',
        borderRadius: '4px',
        marginBottom: '7px',
        backgroundColor: '#ffffff'
    },

    animate: {
        animation: '$animate 1.5s ease-in',
    },
    '@keyframes animate': {
        '50%': {
            opacity: 0.4,
        },
        '100%': {
            opacity: 1,
        },
    },

    steppers: {
        maxWidth: 400,
        margin: 'auto',
        flexGrow: 1,
    },
}));

const searchCompanyInfo = (ticker, dispatch) => {
    fetch(`/${ticker}`).then(response => response.json())
        .then(data => dispatch({
            type: 'STOCK_INFO',
            maxYear: (data.max_year) ? data.max_year : null,
            minYear: (data.min_year) ? data.min_year : null,
            companyInfo: (data.data) ? data.data : null,
        }))
};

export default function TickerBox() {
    const classes = useStyles();
    const theme = useTheme();
    const {state, dispatch} = useContext(AppContext);

    const [activeStep, setActiveStep] = React.useState(0);

    const changePage = (page) => {
        fetch(`/search?text=${state.searchText}&page=${page}`)
            .then(response => response.json())
            .then(data => dispatch({ type: 'STOCK_SEARCH',
                                     search: data.search_text,
                                     pagination: data.pagination,
                                     pages: data.pages,
                                     tickersLeft: data.tickers_left,
                                     tickersRight: data.tickers_right,
            }));
    };

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        changePage((activeStep+1))
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
        changePage((activeStep-1))
    };

    return (
        <React.Fragment>
            <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <div>
                        <List>
                            {state.tickers_left.map((ticker, index) => {
                                return (
                                    <Fade in={true} timeout={{enter: 1000}} style={{ transitionDelay: `${index}00ms`}} key={index}>
                                        <ListItem className={classes.listItem}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                className='pointer'
                                                primary={`${ticker.company} (${ticker.ticker})`}
                                                secondary={ticker.industry}
                                                onClick={() => {
                                                    dispatch({type: 'CLEAN_COMPANY'});
                                                    searchCompanyInfo(`${ticker.ticker}`, dispatch)
                                                } }
                                            />
                                        </ListItem>
                                    </Fade>
                                )
                            })}
                        </List>
                    </div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <div>
                        <List>
                            {state.tickers_right.map((ticker, index) => {
                                return (
                                    <Fade in={true} timeout={{enter: 1000}} style={{ transitionDelay: `${index}00ms` }} key={index}>
                                        <ListItem key={index} className={classes.listItem}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <FolderIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                className='pointer'
                                                primary={`${ticker.company} (${ticker.ticker})`}
                                                secondary={ticker.industry}
                                                onClick={() => {
                                                    dispatch({type: 'CLEAN_COMPANY'});
                                                    searchCompanyInfo(`${ticker.ticker}`, dispatch)
                                                } }
                                            />
                                        </ListItem>
                                    </Fade>
                                )
                            })}
                        </List>
                    </div>
                </Grid>


            </Grid>
            {(state.pagination) ?
                <Typography component={'div'} align="center">
                    <MobileStepper
                        variant="dots"
                        steps={state.pages}
                        position="static"
                        activeStep={activeStep}
                        className={classes.steppers}
                        nextButton={
                            <Button size="small" onClick={handleNext} disabled={activeStep === (state.pages-1)}>
                                Next
                                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                Back
                            </Button>
                        }
                    />
                </Typography> : null
            }

        </React.Fragment>

    );
}