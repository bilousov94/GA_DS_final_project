import React, { useContext } from 'react';
import {makeStyles} from "@material-ui/core/styles/index";

//Elements
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

//Icons
import FolderIcon from '@material-ui/icons/Folder';

//Context
import { AppContext } from '../App'

const useStyles = makeStyles(theme => ({
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
}));

export default function TickerBox() {
    const classes = useStyles();
    const {state, dispatch} = useContext(AppContext);

    return (
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
                                                dispatch({ type: 'CLEAN_TICKER'});
                                                setTimeout(() => { dispatch({ type: 'SELECT_TICKER', ticker: `${ticker.ticker}`}) } , 100)
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
                                                dispatch({ type: 'CLEAN_TICKER'});
                                                setTimeout(() => { dispatch({ type: 'SELECT_TICKER', ticker: `${ticker.ticker}`}) } , 100)
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
    );
}