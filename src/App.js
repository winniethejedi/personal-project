import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import AddRecipe from './Components/AddRecipe/AddRecipe';
import Recipe from './Components/Recipe/Recipe';
import Profile from './Components/Profile/Profile';
import axios from 'axios';
import { loginAction } from './Redux/Actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';

class App extends Component {
  componentDidMount(){
    axios.get('/api/user/me')
      .then((res) => {
        this.props.loginAction(res.data);
      })
  }
  render() {
    return (
        <Router>
          <Switch>
            <Route path={`/dashboard`} component={ Dashboard }/>
            <Route path={`/add-recipe`} component={ AddRecipe }/>
            <Route path={'/profile/:userid'} component={ Profile }/>
            <Route path={'/recipe/:recipeid'} component={ Recipe }/>
            <Route path={`/`} component={ Login }/>
          </Switch>
        </Router>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({loginAction}, dispatch);
}

export default connect(state => state, mapDispatchToProps)(App);
