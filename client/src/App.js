import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import EditProfile from './components/EditProfile';
import LogCatch from './components/LogCatch';
import CatchList from './components/CatchList';

function App() {
  return (
    <div className="App">
      <Router>
          <NavBar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/editprofile" component={EditProfile} />
              <Route path="/catch" component={LogCatch} /> 
              <Route path="/catchlist" component={CatchList} /> 
            </PrivateRoute>
          </Switch>
        </Router>
    </div>
  );
}

export default App;