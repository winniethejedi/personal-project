import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import AddRecipe from './Components/AddRecipe/AddRecipe';
import EditRecipe from './Components/EditRecipe/EditRecipe';
import Recipe from './Components/Recipe/Recipe';
import Profile from './Components/Profile/Profile';
import Loading from './Components/Loading/Loading';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { loginAction, allRecipesAction, searchRecipesAction, userRecipesAction, ingredientsAction } from './Redux/Actions/actions';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoaded : false
    }
  }
  componentWillMount(){
    axios.get('/api/user/me')
      .then((res) => {
        this.props.loginAction(res.data);
        if (this.props.allRecipes.length === 0){
          this.setState({
            isLoaded: false
          })
             axios.get('/api/recipes')
              .then(res => {
                this.props.allRecipesAction(res.data);
                this.setState({
                  isLoaded: true
                })
                const userRecipes = this.props.allRecipes.filter((recipe) => {
                  return recipe.user_id === this.props.login.id;
                })
                this.props.userRecipesAction(userRecipes);
          })
        }
      })
   
  }
  render() {
    if(this.state.isLoaded){
      return (
        <Router>
          <Switch>
            <Route path={`/dashboard`} component={ Dashboard }/>
            <Route path={`/add-recipe`} component={ AddRecipe }/>
            <Route path={'/profile/:userid'} component={ Profile }/>
            <Route path={'/recipe/:recipeid'} component={ Recipe }/>
            <Route path={`/edit-recipe/:recipeid`} component = { EditRecipe }/>
            <Route path={`/`} component={ Login }/>
          </Switch>
        </Router>
    );
    }else{
      return <div><Loading/></div>
    }

  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({loginAction, allRecipesAction, searchRecipesAction, userRecipesAction, ingredientsAction}, dispatch);
}

export default connect(state => state, mapDispatchToProps)(App);
