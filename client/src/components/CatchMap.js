import React, {Component} from 'react';
import ReactMapGl, {Marker, Popup} from 'react-map-gl';
import Pin from './Pin';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import Geocoder from 'react-map-gl-geocoder'

class CatchMap extends Component {
    constructor(props){
        super(props);
        this.state = {
            viewport: {
               width: "100%",
               height: "50vh",
               latitude: 42.430472,
               longitude: -123.334102,
               zoom: 16
             },
            userLocation: {},
            events: {},
            selectedLocation: null
        };
    }
    mapRef = React.createRef();

    componentDidMount() {
        this.setUserLocation();
    }
    
    setUserLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            let setUserLocation = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
            console.log(setUserLocation);
            let newViewport = {
                width: "100%",
                height: "50vh",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                zoom: 15
            };
            this.setState({
                viewport: newViewport,
                userLocation: setUserLocation
            });
            this.props.setCoordinates(setUserLocation);
        });
    };

    showPopUp = (e) => {
        e.preventDefault();
        this.setState({
            selectedLocation: "This is my location"
        })
    }
    
    _logDragEvent(name, event) {
        this.setState({
            events: {
            ...this.state.events,
            [name]: event.lngLat
            }
        });
    }

    _onMarkerDragStart = event => {
        this._logDragEvent('onDragStart', event);
    };

    _onMarkerDrag = event => {
        this._logDragEvent('onDrag', event);
    };

    _onMarkerDragEnd = event => {
        this._logDragEvent('onDragEnd', event);
        this.setState({
            userLocation: {
                long: event.lngLat[0],
                lat: event.lngLat[1]
            }
        });
        console.log(this.state.userLocation);
        this.props.setCoordinates(this.state.userLocation);
    }

    handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = {transitionDuration: 1000}
        return this.handleViewportChange({
          ...viewport,
          ...geocoderDefaultOverrides
        })
    }

    handleViewportChange = (viewport) => {
        this.setState({
          viewport: {...this.state.viewport, ...viewport}
        })
    }

    render() {
        const {selectedLocation} = this.state;
        return (
            <div>
                
                <div>
                    <ReactMapGl
                        ref={this.mapRef}
                        {...this.state.viewport}
                        onViewportChange={viewport => this.setState({ viewport })}
                        mapboxApiAccessToken="pk.eyJ1Ijoibmh1YW5nNzEzIiwiYSI6ImNrOG9jOG1tZzE3bWszZm53enI2aDUza2QifQ.F2xJPRVWhz908h2nQhuTqg"
                        mapStyle="mapbox://styles/nhuang713/ck8s1ki8t08fc1iqj0yerkni8"
                    >
                        <button onClick={this.setUserLocation}>My Location</button>
                        {Object.keys(this.state.userLocation).length !== 0 ? (
                            <Marker
                                latitude={this.state.userLocation.lat}
                                longitude={this.state.userLocation.long}
                                draggable
                                onDragStart={this._onMarkerDragStart}
                                onDrag={this._onMarkerDrag}
                                onDragEnd={this._onMarkerDragEnd}
                            >
                                <Pin size={20} />
                            </Marker>
                        ) : (
                            <div></div>
                        )
                    }
                    {selectedLocation && 
                        <Popup
                            latitude={this.state.userLocation.lat}
                            longitude={this.state.userLocation.long}
                        >
                            <div>
                                {selectedLocation}
                            </div>
                        </Popup>
                    }
                        <Geocoder
                            mapRef={this.mapRef}
                            onViewportChange={this.handleGeocoderViewportChange}
                            mapboxApiAccessToken="pk.eyJ1Ijoibmh1YW5nNzEzIiwiYSI6ImNrOG9jOG1tZzE3bWszZm53enI2aDUza2QifQ.F2xJPRVWhz908h2nQhuTqg"
                            types="poi"
                        />
                    </ReactMapGl>
                </div>
            </div>
        )
    }
}

export default CatchMap;