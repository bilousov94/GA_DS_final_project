import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import {makeStyles} from "@material-ui/core/styles/index";

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
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
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
                        Footer
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        Something here to give the footer a purpose!
                    </Typography>
                    <Copyright />
                </Container>
            </footer>
        )
}




