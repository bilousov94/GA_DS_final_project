import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import {makeStyles} from "@material-ui/core/styles/index";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import CodeIcon from '@material-ui/icons/Code';

const useStyles = makeStyles(theme => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(8),
        padding: theme.spacing(6, 0),
    },
}));

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.linkedin.com/in/valentyn-bilousov/">
                Valentyn Bilousov
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Footer() {
    const classes = useStyles();
        return(
            <footer className={classes.footer}>
                <Container maxWidth="lg">
                    <Typography variant="h6" align="center" gutterBottom>
                        Stock Prediction and News App
                    </Typography>
                    <Typography align="center">
                        <Link color="inherit" href="https://www.linkedin.com/in/valentyn-bilousov/">
                           <LinkedInIcon fontSize={'large'}/>
                        </Link>
                        <Link color="inherit" href="https://github.com/bilousov94">
                            <CodeIcon fontSize={'large'}/>
                        </Link>
                    </Typography>
                    <Copyright />
                </Container>
            </footer>
        )
}




