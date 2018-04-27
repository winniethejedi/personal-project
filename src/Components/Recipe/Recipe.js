import React, { Component } from 'react';
import Header from '../Header/Header';
import { connect } from 'react-redux';
import axios from 'axios';

class Recipe extends Component {
  constructor(props){
    super(props);
    this.state = {
      recipe: {},
    }
  }

  componentWillMount(){
    const recipeInfoArray = this.props.allRecipes.filter(recipe => {
      return recipe.id.toString() === this.props.match.params.recipeid.toString();
    });

    const recipeInfoObject = recipeInfoArray[0];

    this.setState({
      recipe: recipeInfoObject
    });
  }

  render() {
    const ingredients = this.state.recipe.ingredients.join(', ');
    const categories = this.state.recipe.categories.join(', ');
    return (
        <div>
          <Header/>
          <h1>{this.state.recipe.name}</h1>
          <img className='recipe-page-recipe-image'  src={this.state.recipe.image} alt={this.state.recipe.name}/>
          <p>By: {this.state.recipe.user.username}</p>
          <img className='recipe-page-user-image'  src={this.state.recipe.user.profile_pic} alt={this.state.recipe.user.name}/>
          <p>{this.state.recipe.description}</p>
          <p>Ingredients: {ingredients}</p>
          <p>Preparation time: {this.state.recipe.time} minutes</p>
          <p>{this.state.recipe.directions}</p>
          <p>Categories: {categories}</p>
        </div>
    );
  }
}

export default connect(state => state)(Recipe);