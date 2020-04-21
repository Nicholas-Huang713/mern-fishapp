import React from 'react';
import '../App.css';
import axios from 'axios';
import {getJwt} from '../helpers/jwt';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ReactMapGl, {Marker, Popup} from 'react-map-gl';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withRouter } from "react-router-dom";
import Map from './Map';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class Dashboard extends React.Component {
  state = {
    currentUser: null
  }

  componentDidMount(){
    this.retrieveUser();
  }

  retrieveUser = () => {
    const jwt = getJwt();
      axios({ 
      url: '/api/getuser',
      method: 'GET',
      headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then((res) => {
      const user = res.data;
      console.log(JSON.stringify(user));
      this.setState({currentUser: user});
    })
    .catch((err) => {
      console.log('Error:' + err);
    });
  }

  render() {
    const {currentUser} = this.state;
    return (
      <div>
        <Grid 
          container
          justify="flex-start"
          alignItems="flex-start"
        >
          <Grid item xs={10} sm={6} md={6} lg={4}>
            <Paper className="text-center ml-2 mt-2" elevation={3}>
              {
                currentUser ?
                <h3>
                  {currentUser.firstname} {currentUser.lastname}
                  <Tooltip title="Edit Profile">
                    <IconButton onClick={() => this.props.history.push('/editprofile')} aria-label="edit profile">
                      <EditIcon />
                    </IconButton>

                  </Tooltip>
                </h3>
                :
                <h3><EditIcon /></h3>
              }
               
            </Paper>
          </Grid>
          <Tooltip title="Post New Catch">
            <Fab size="medium" color="secondary" aria-label="add" className="ml-2 mt-2">
              <AddIcon onClick={() => this.props.history.push("/catch") }/>
            </Fab>
          </Tooltip>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Map />
            </Paper>
          </Grid>
        </Grid>
        
      </div>
    ); 
  }
}

export default withRouter(Dashboard);