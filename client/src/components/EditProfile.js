import React, {useState, useEffect} from 'react';
import '../App.css';
import {getJwt} from '../helpers/jwt';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

function EditProfile() {
  let history = useHistory();
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    retrieveUser();
  },[]);

  const retrieveUser = () => {
    const jwt = getJwt();
    axios({ 
        url: '/api/getuser',
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then((res) => {
        const user = res.data;
        setFirstName(user.firstname);
        setLastName(user.lastname);
        setEmail(user.email);
    })
    .catch((err) => {
        console.log('Error:' + err);
    });
  }

  const handleEdit = (e) => {
    if(firstName.length <= 2){
        setErrMsg("First Name must be longer than 2 characters");
        e.preventDefault();
        return;
    } else if(lastName.length <= 2){
        setErrMsg("Last name must be longer than 2 characters");
        e.preventDefault();
        return;
    }else if(email.length <= 5) {
        setErrMsg("Email must be longer than 5 characters");
        e.preventDefault();
        return;
    }
    e.preventDefault();
    const jwt = getJwt();
    const updatedUser = {firstName, lastName, email};
    axios({ 
        url: '/api/editprofile',
        method: 'PUT',
        data: updatedUser,
        headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then(() => {
        console.log("updated");
    })
    .catch((err) => {
        console.log(err);
    })
    setOpen(true);
  }

  return (
    <div className={classes.root}>
      <Grid 
        container
        direction="row"
        justify="center"
        alignItems="center"
        className="edit-container"
      >
        <Grid item xs={11} md={8} lg={6}>
          <Paper className={classes.paper}>
            <h2>Edit Profile </h2>
            <p className="text-danger">{errMsg}</p>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  className="form-control"  
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" variant="contained" color="primary">Update User</Button>
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
        message="User Updated"
        action={
          <React.Fragment>
            <Button color="secondary" size="small" onClick={() => history.push('/dashboard')}>
              Dashboard
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

export default EditProfile;