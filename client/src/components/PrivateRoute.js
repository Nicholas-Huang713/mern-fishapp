import React from 'react';
import { withRouter} from "react-router-dom";
import {getJwt} from '../helpers/jwt';

class PrivateRoute extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      token: undefined
    }
  }

  componentDidMount =() => {
    const jwt = getJwt();
    if(!jwt) {
      this.props.history.push('/');
    }
    this.setState({
      token: jwt
    })
  }
  
  componentWillUnmount(){
    this.setState({
      token: undefined
    })
  }
  render(){
    const {token} = this.state;
    if(token === undefined){
      return (
        <div><h1>Loading...</h1></div>
      )
    }
    return (
      <div> {this.props.children}</div>    
    );   
  }      
}

export default withRouter(PrivateRoute);
