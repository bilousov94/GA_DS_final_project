import React, { useReducer } from 'react';
import './App.css';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';

import { makeStyles } from '@material-ui/core/styles';

import SearchBox from './components/SearchBox'
import MainPost from './components/MainPost';
import Footer from './components/Footer';
import Posts from './components/Posts';
import TickerBox from './components/TickerBox'
import Company from './components/Company';
import Predictions from './components/Predictions'

import update from 'immutability-helper';

export const AppContext = React.createContext();

const useStyles = makeStyles({
    toolbarTitle: {
        flex: 1,
    },
});

const initialState = {

    //We using this states to control search results
    searchText: '',
    pagination: false,
    pages: 0,
    tickers_left: [],
    tickers_right: [],

    // This data is using for rendering company info
    companyInfo: null,
    maxHistoryYear: null,
    minHistoryYear: null,

    //This data is using for as prediction filters
    model: false,
    predictionStartDate: null,
    predictionEndDate: null
};

function reducer(state, action) {
    switch (action.type) {
        case 'STOCK_SEARCH':
            return update(state, {
                searchText: {$set: action.search},
                pages: {$set: action.pages},
                pagination: {$set: action.pagination},
                tickers_left: {$set: action.tickersLeft},
                tickers_right: {$set: action.tickersRight},
            });

        case 'STOCK_INFO':
            return update(state, {
                companyInfo: {$set: action.companyInfo},
                maxHistoryYear: {$set: action.maxYear},
                minHistoryYear: {$set: action.minYear},
                model: {$set: null}
            });

        case 'SELECT_MODEL':
            return update(state, {
                model: {$set: action.model},
                predictionStartDate: {$set: action.startDate},
                predictionEndDate: {$set: action.endDate},
            });

        case 'CLEAN_COMPANY':
            return update(state, {
                companyInfo: {$set: null},
                maxHistoryYear: {$set: null},
                minHistoryYear: {$set: null},
                model: {$set: null}
            });

        default:
            return initialState;
    }
}

export default function App() {
    const classes = useStyles();
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography
                        component="h2"
                        variant="h5"
                        color="inherit"
                        align="center"
                        noWrap
                        className={classes.toolbarTitle}
                    >
                        Stock Prediction and News App
                    </Typography>

                </Toolbar>
                <AppContext.Provider value={{ state, dispatch }}>
                    <SearchBox/>
                    {(state.tickers_left.length) ? <TickerBox/> : null}
                    {(state.companyInfo) ? <Company/> : null}
                    {(state.model) ? <Predictions /> : null}
                    {/*<Company/>*/}
                    <main>
                        {/* Main featured post */}
                        <MainPost/>
                        <Posts/>
                    </main>

                </AppContext.Provider>
            </Container>
            <Footer/>
        </React.Fragment>
    );
}

