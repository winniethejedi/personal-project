import React, { Component } from 'react';
import Header from '../Header/Header';
import { connect } from 'react-redux';
import RecipeDiv from '../RecipeDiv/RecipeDiv';
import Loading from '../Loading/Loading';


class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: {},
      userRecipes: [],
      isLoaded: false
    }
}

componentDidMount() {
  const userId = parseInt(this.props.match.params.userid, 10)
  const userInfo = this.props.users.find((user, i) => {
    return user.id === userId;
  });
  const userRecipesInfo = this.props.allRecipes.find((recipe, i) => {
    return userId === recipe.user_id;
  })
  this.setState({
    user: userInfo,
    userRecipes: userRecipesInfo,
    isLoaded: true
  });
}

  render() {
    const userRecipes = [];
    if (userRecipes.length !==0){
      userRecipes.push(
        this.state.userRecipes.map((recipe, i) => {
          return <RecipeDiv  key={recipe.id} id={recipe.id} name={recipe.name} description={recipe.description} time={recipe.time} categories={recipe.categories} image={recipe.image} user_id={recipe.user_id} ingredientsIds={recipe.ingredientsIds} categoriesIds={recipe.categoriesIds} />
        })
      )
    }
    if (!this.state.isLoaded){
      return (
        <div>
          <Header/>
          <Loading/>
        </div>
      )
    }
    else if (parseInt(this.props.match.params.userid, 10)  ===  this.props.login.id) {
      return (
        <div>
          <Header/>
          <img className='profile-pic' src={this.props.login.profile_pic} alt={this.props.login.username}/>
          <h1>My Profile</h1>
          <h2>My Recipes</h2>
            {userRecipes}
          <h2>Favorite Recipes</h2>
          <h2>Following</h2>
          <h2>Followers</h2>
        </div>
      );
    }
    else if (this.state.user) {
      return (
        //figure out how to not make it break when reloading
        <div>
          <Header />
          <img className='profile-pic' src= {this.state.user.profile_pic} alt={this.state.user.username}/>
          <h1>{this.state.user.username}'s Profile</h1>
          <h2>{this.state.user.username}'s Recipes</h2>
            {userRecipes}
          <h2>Favorite Recipes</h2>
          <h2>Following</h2>
          <h2>Followers</h2>
        </div>
      )
    } 
  }
}

export default connect(state => state)(Profile);