import React from 'react';
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
}));

function Home() {
    const classes = useStyles();
    let history = useHistory();
    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12} className="home-container">
                    <div className="home-style">
                        <h1 className="mt-5 text-large">FishOn!</h1>
                        <h2>Find and share the best fishing spots!</h2>
                        <Button onClick={() => history.push('/register')}variant="contained" size="large" color="primary">Sign Up</Button>
                    </div>
                    
                </Grid>
            </Grid>
        </div>
    );
}

export default Home;