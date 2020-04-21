import React, {useState} from 'react';
import '../App.css';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

function Register() {
  let history = useHistory();
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {firstName, lastName, email, password};
    axios.post('/api/register', newUser)
      .then((res) => {
        const token = res.data;
        localStorage.setItem('token', token);
        history.push('/dashboard');      
      })
      .catch((err) => {
        setErrMsg(err.response.data);
        console.log(err);
      })
  }

  return (
    <div className={classes.root}>
      <Grid container
            direction="row"
            justify="center"
            alignItems="center"
            className="reg-container"
      >
        <Grid item xs={11} md={8} lg={6}>
          <Paper className={classes.paper}>
            <h2>Register</h2>
            <p className="text-danger">{errMsg}</p>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>First Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter First Name" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  type="text" 
                  className="form-control"  
                  placeholder="Enter Last Name" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                />
                <small id="emailHelp" className="form-text text-muted">We won't share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password" 
                  className="form-control" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" variant="contained" color="primary">Create User</Button>
            </form>
          </Paper>
        </Grid>
    </Grid>
    </div>
  );
}

export default Register;