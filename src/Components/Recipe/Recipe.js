import React, { Component } from 'react';
import Header from '../Header/Header';
import { connect } from 'react-redux';
// import { bindActionCreators} from 'redux';
import * as Actions from '../../Redux/Actions/actions';
import axios from 'axios';
// import RaisedButton from 'material-ui/RaisedButton';
// import { Link } from 'react-router-dom';
import RecipeButtons from '../RecipeButtons/RecipeButtons';
import Loading from '../Loading/Loading';

// const style = {
//   margin: 12,
// };

class Recipe extends Component {
  constructor(props){
    super(props);
    this.state = {
      recipe: null,
    }
    this.getData = this.getData.bind(this);
  }

  componentDidMount(){
    if (this.props.allRecipes.length === 0) {
      this.props.history.push('/dashboard')
    }
    else {
      const recipeInfoArray = this.props.allRecipes.filter(recipe => {
        return recipe.id.toString() === this.props.match.params.recipeid.toString();
      });
      const recipeInfoObject = recipeInfoArray[0];
  
      if (recipeInfoObject.user === undefined) {
          this.getData(recipeInfoObject);
      }

      if (recipeInfoObject.user_id === this.props.login.id) {
        recipeInfoObject.canEdit = true;
      }
      else {
        recipeInfoObject.canEdit = false;
      }

      recipeInfoObject.favorited = false;

      this.setState({
        recipe: recipeInfoObject
      });
      this.props.viewedRecipeAction(recipeInfoObject);
    }
  }

  async getData(recipeInfoObject) {
    const foundUser = await axios.get(`/api/user?id=${recipeInfoObject.user_id}`)
    const foundIngredients = await axios.post('/api/recipe-ingredients', {
      ingredientsIds: recipeInfoObject.ingredientsIds
    })
    const foundCategories = await axios.post('/api/recipe-categories', {
      categoriesIds: recipeInfoObject.categoriesIds
    })

    recipeInfoObject.user = foundUser.data;
    const userRecipeId = {
      recipeId: recipeInfoObject.id,
      user: foundUser.data
    }
    this.props.userToRecipeAction(userRecipeId);
    const savedUserIds = this.props.users.map((user, i) => {
      return user.id;
    })
    if (!savedUserIds.includes(recipeInfoObject.id)) {
      this.props.usersAction(recipeInfoObject);
    }
    //ingredients
    const ingredients = foundIngredients.data.map(ingredient => {
      return ingredient[0].name;
    })
    recipeInfoObject.ingredients = ingredients;
    const ingredientsRecipeId = {
      recipeId: recipeInfoObject.id,
      ingredients: ingredients
    }
    this.props.ingredientsToRecipeAction(ingredientsRecipeId);
    //categories
    const categories = foundCategories.data.map(category => {
      return category[0].name;
    })
    recipeInfoObject.categories = categories;
    const categoriesRecipeId = {
      recipeId: recipeInfoObject.id,
      categories: categories
    }
    this.props.categoriesToRecipeAction(categoriesRecipeId);
    this.setState({
      recipe: recipeInfoObject
    });
  }

  

  render() {
    let page;
    if(this.state.recipe && this.state.recipe.ingredients && this.state.recipe.categories){
      const ingredients = this.state.recipe.ingredients.join(', ');
      const categories = this.state.recipe.categories.join(', ');
      page = 
      <div>
        <h1>{this.state.recipe.name} </h1>
        <img className='recipe-page-recipe-image'  src={this.state.recipe.image} alt={this.state.recipe.name}/>
        <p>By: {this.state.recipe.user.username}</p>
        <img className='recipe-page-user-image'  src={this.state.recipe.user.profile_pic} alt={this.state.recipe.user.name}/>
        <p>{this.state.recipe.description}</p>
        <p>Ingredients: {ingredients}</p>
        <p>Preparation time: {this.state.recipe.time} minutes</p>
        <p>{this.state.recipe.directions}</p>
        <p>Categories: {categories}</p>
        <RecipeButtons childState = {this.state} />
      </div>

    }else{
      page =  <div><Loading/></div>
    }
    return(
      <div>
        <Header/>
        {page}
      </div>
    )
  }
}


export default connect(state => state, Actions)(Recipe);