import React, {useState} from 'react';
import '../App.css';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CatchMap from './CatchMap';
import {getJwt} from '../helpers/jwt';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
}));

function LogCatch() {
  let history = useHistory();
  const classes = useStyles();
  const [species, setSpecies] = useState("");
  const [water, setWater] = useState("");
  const [bait, setBait] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);

  const submitCatch = (e) => {
    e.preventDefault();
    const jwt = getJwt();
    const newCatch = {species, water, bait, latitude, longitude};
    if(species === "" || water === "" || bait === ""){
        setErrMsg("All fields must be completed");
        return;
    }
    axios({ 
        url: '/api/catch',
        method: 'POST',
        data: newCatch,
        headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then((res) => {
        console.log(res.data);
        setOpen(true);
    })
    .catch((err) => {
        console.log('Error:' + err);
    });
  }

  const setCoordinates = (location) => {
    setLatitude(location.lat);
    setLongitude(location.long);
  }

  return (
    <div className={classes.root}>
      <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            className="catch-container"
      >
        <Grid item xs={11} md={8} lg={6} className="mt-3 mb-3">
          <Paper className={classes.paper}>
            <h2>Log Catch</h2>
            <CatchMap setCoordinates={setCoordinates}/>
            <p className="text-danger">{errMsg}</p>
            <form onSubmit={submitCatch}>
                <div className="form-group">
                    <label>Species</label>
                    <select value={species} onChange={e => setSpecies(e.target.value)} className="form-control">
                        <option></option>
                        <option value="bass">Bass</option>
                        <option value="trout">Trout</option>
                        <option value="tuna">Tuna</option>
                        <option value="salmon">Salmon</option>
                    </select>
                </div> 
                <div className="form-group">
                    <label>Bait Used</label>
                    <select value={bait} onChange={e => setBait(e.target.value)} className="form-control" >
                        <option></option>
                        <option value="live bait">Live Bait</option>
                        <option value="lure">Lure</option>
                        <option value="corn">Corn</option>
                        <option value="bread">Bread</option>
                    </select>
                </div> 
                <div className="form-group">
                    <label>Park/Body of Water</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Body of Water" 
                        value={water} 
                        onChange={e => setWater(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="contained" color="primary">Log Catch</Button>
            </form>
          </Paper>
        </Grid>
    </Grid>
    <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message="Catch logged"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={() => history.push('/catchlist')}>
              Catch Log
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default LogCatch;