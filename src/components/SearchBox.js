import React, { useContext } from 'react';
import {makeStyles} from "@material-ui/core/styles/index";
import AwesomeDebouncePromise from 'awesome-debounce-promise';


//Elements
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

//Icons
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

//Context
import { AppContext } from '../App'

const sections = [
    'Technology',
    'Design',
    'Culture',
    'Business',
    'Politics',
    'Opinion',
    'Science',
    'Health',
    'Style',
    'Travel',
];

const useStyles = makeStyles(() => ({
    toolbar: {
        borderBottom: `1px solid black`,
    },
    toolbarTitle: {
        flex: 1,
    },
    toolbarSecondary: {
        justifyContent: 'space-between',
        overflowX: 'auto',
    },
    toolbarLink: {
        padding: '8px',
        flexShrink: 0,
    },

    //Search box
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        marginLeft: '8px',
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
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
    }
}));

const searchApi = (search_text, dispatch) => {
        if(search_text){
            fetch(`/search_tickers/${search_text}`)
                .then(response => response.json())
                .then(data => dispatch({ type: 'STOCK_SEARCH',
                                         search: data.search_text,
                                         pagination: data.pagination,
                                         pages: data.pages,
                                         tickersLeft: data.tickers_left,
                                         tickersRight: data.tickers_right,
                                         selectedTicker: false
                                        }))
        } else {
            dispatch({ type: 'STOCK_SEARCH',
                       search: '',
                       pagination: false,
                       pages: 0,
                       tickersLeft: [],
                       tickersRight: [],
                       selectedTicker: false});
        }
    };

const searchAPIDebounced = AwesomeDebouncePromise(searchApi, 500);

export default function SearchBox() {
    const classes = useStyles();
    const { dispatch } = useContext(AppContext);
    return(
        <React.Fragment>
            <Paper className={classes.root}>
                <InputBase
                    className={classes.input}
                    placeholder="Type Ticker, Company or Industry"
                    onChange={e => searchAPIDebounced(e.target.value, dispatch)}
                />
                <IconButton className={classes.iconButton} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                {sections.map(section => (
                    <Link
                        color="inherit"
                        noWrap
                        key={section}
                        variant="body2"
                        href="#"
                        className={classes.toolbarLink}
                    >
                        {section}
                    </Link>
                ))}
            </Toolbar>
        </React.Fragment>
    )
}


