import React, {useState, useEffect} from 'react';
import '../App.css';
import ReactMapGl, {GeolocateControl, Marker, Popup} from 'react-map-gl';
import Button from '@material-ui/core/Button';
import trout from '../images/trout.png';
import salmon from '../images/salmon.png';
import tuna from '../images/tuna.png';
import bass from '../images/bass.png';
import lure from '../images/lure.png';
import bread from '../images/bread.png';
import worm from '../images/worm.png';
import corn from '../images/corn.png';
import {getJwt} from '../helpers/jwt';
import axios from 'axios';

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
};

const fishStyle = {
  width: "70px",
  height: "auto"
}

const baitStyle = {
  width: "50px",
  height: "auto"
}

const popUpStyle = {
  padding: 30
}

function Map() {
  const [viewport, setViewport] = useState({
    latitude: 33.985736,
    longitude: -117.818969,
    zoom: 12,
    width: "100%",
    height: "83.5vh"
  })
  const [catchList, setCatchList] = useState([]);
  const [currentId, setCurrentId] = useState(0);

  useEffect(() => {
    retrieveCatches();
  },[]);

  const retrieveCatches = () => {
    const jwt = getJwt();
    axios({ 
        url: '/api/allcatches',
        method: 'GET',
        headers: {'Authorization' : `Bearer ${jwt}`}
    })
    .then((res) => {
        console.log("All Catches: " + JSON.stringify(res.data));
        setCatchList(res.data);
    })
    .catch((err) => {
        console.log('Error:' + err);
    });
  }

  return (
    <div>
      <ReactMapGl 
        {...viewport} mapboxApiAccessToken="pk.eyJ1Ijoibmh1YW5nNzEzIiwiYSI6ImNrOG9jOG1tZzE3bWszZm53enI2aDUza2QifQ.F2xJPRVWhz908h2nQhuTqg"
        mapStyle="mapbox://styles/nhuang713/ck8s1ki8t08fc1iqj0yerkni8"
          onViewportChange={viewport => {
            setViewport(viewport);
          }}
      >
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{enableHighAccuracy: true}}
          trackUserLocation={true}
          showUserLocation={false}
        />
        {catchList.map((fish) => {
          return(
            <span>
            <Marker 
             key={fish._id}
             latitude={fish.latitude}
             longitude={fish.longitude}
            >
              <Button onClick={() => setCurrentId(fish._id)}>             
                {fish.species === "trout" && 
                  <img src={trout} style={fishStyle} alt="fish marker" />
                }
                {fish.species === "tuna" && 
                  <img src={tuna} style={fishStyle} alt="fish marker" />
                }
                {fish.species === "salmon" && 
                  <img src={salmon} style={fishStyle} alt="fish marker" />
                }
                {fish.species === "bass" && 
                  <img src={bass} style={fishStyle} alt="fish marker" />
                }
              </Button> 
              
            </Marker>
            {
                currentId === fish._id &&
                <Popup
                  latitude={fish.latitude}
                  longitude={fish.longitude}
                  closeOnClick={true}
                  closeButton={true}
                >
                  <div style={popUpStyle}>
                    Species: {fish.species}
                    <br/>
                    Angler: {fish.creatorName}
                    <br/>
                    Location: {fish.water}
                    <br/>
                    Bait:
                    {fish.bait === "lure" && 
                      <img src={lure} style={baitStyle} alt="fishing bait" />
                    }
                    {fish.bait === "live bait" && 
                      <img src={worm} style={baitStyle} alt="fishing bait" />
                    }
                    {fish.bait === "bread" && 
                      <img src={bread} style={baitStyle} alt="fishing bait" />
                    }
                    {fish.bait === "corn" && 
                      <img src={corn} style={baitStyle} alt="fishing bait" />
                    }
                  </div>
                </Popup>
              }
              </span>
          )
        })}
      </ReactMapGl>
    </div>
  );
}

export default Map;
