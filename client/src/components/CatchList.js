import React, {useState, useEffect} from 'react';
import '../App.css';
import {getJwt} from '../helpers/jwt';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import trout from '../images/trout.png';
import salmon from '../images/salmon.png';
import tuna from '../images/tuna.png';
import bass from '../images/bass.png';

const useStyles = makeStyles({
  root: {
    maxWidth: "90%",
  },
  media: {
    height: 150,
  },
});

function CatchList() {
    const classes = useStyles();
    const [catchList, setCatchList] = useState([]);

    useEffect(() => {
        retrieveCatches();
    },[]);

    const retrieveCatches = () => {
        const jwt = getJwt();
        axios({ 
            url: '/api/usercatches',
            method: 'GET',
            headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            console.log(res.data);
            setCatchList(res.data);
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }

    const deleteCatch = (catchId) => {
        const jwt = getJwt();
        axios({ 
            url: `/api/deletecatch/${catchId}`,
            method: 'DELETE',
            headers: {'Authorization' : `Bearer ${jwt}`}
        })
        .then((res) => {
            console.log(res.data);
            setCatchList(res.data);
        })
        .catch((err) => {
            console.log('Error:' + err);
        });
    }   

    return (
        <div>
            <Grid container
                justify="center"
                alignItems="center"
            >
            {
                catchList.map((fish) => {
                    return (
                        <Grid item xs={11} md={4} className="mt-2">
                            <Card className={classes.root}>
                                    {fish.species === "salmon" && 
                                        <CardMedia
                                            className={classes.media}
                                            image={salmon}
                                            title="Fish Species"
                                        />
                                    }
                                    {fish.species === "trout" && 
                                        <CardMedia
                                            className={classes.media}
                                            image={trout}
                                            title="Fish Species"
                                        />
                                    }
                                    {fish.species === "tuna" && 
                                        <CardMedia
                                        className={classes.media}
                                        image={tuna}
                                        title="Fish Species"
                                        />
                                    }
                                    {fish.species === "bass" && 
                                        <CardMedia
                                        className={classes.media}
                                        image={bass}
                                        title="Fish Species"
                                        />
                                    }
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {fish.species}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {fish.water}
                                        </Typography>
                                    </CardContent>
                                <CardActions>
                                    <Button onClick={() => deleteCatch(fish._id)} size="small" color="primary">
                                        Remove
                                    </Button>
                                    
                                </CardActions>
                            </Card>
                        </Grid>
                    )
                })
            }
            </Grid>
        </div>
    );
}

export default CatchList;