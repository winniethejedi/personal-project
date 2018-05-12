import React, { Component } from 'react';
import axios from 'axios';

class axiosFunctions extends Component {
  constructor(props){
    super(props)
  }
  getAllRecipes() {
    axios.get('/api/recipes')
    .then(res => {
      this.props.allRecipesAction(res.data);
      // this.setState({
      //   isLoaded: true
      // })
      const userRecipes = this.props.allRecipes.filter((recipe) => {
        return recipe.user_id === this.props.login.id;
      })
      this.props.userRecipesAction(userRecipes);
}) 
}

 getUserInfo() {
    axios.get(`/api/user?id=${this.props.user_id}`)
    .then(res => {
      this.setState({
        user: res.data
      })
      const userRecipeId = {
        recipeId: this.props.id,
        user: res.data
      }
      this.props.userToRecipeAction(userRecipeId);
      const savedUserIds = this.props.users.map((user, i) => {
        return user.id;
      })
      if (!savedUserIds.includes(this.state.user.id)) {
        this.props.usersAction(this.state.user);
      }
    })
}

getIngredientsInfo() {
    axios.post('/api/recipe-ingredients', {
        ingredientsIds: this.props.ingredientsIds
      })
        .then(res => {
          const ingredients = res.data.map(ingredient => {
            return ingredient[0].name;
          })
          this.setState({
            ingredients: ingredients
          })
          const ingredientsRecipeId = {
            recipeId: this.props.id,
            ingredients: ingredients
          }
          this.props.ingredientsToRecipeAction(ingredientsRecipeId);
        })
}

 getCategoriesInfo() {
    axios.post('/api/recipe-categories', {
        categoriesIds: this.props.categoriesIds
      })
        .then(res => {
          const categories = res.data.map(category => {
            return category[0].name;
          })
          this.setState({
            categories: categories
          })
          const categoriesRecipeId = {
            recipeId: this.props.id,
            categories: categories
          }
          this.props.categoriesToRecipeAction(categoriesRecipeId);
        })
}

}

