import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ingredientsToRecipeAction, categoriesToRecipeAction, userToRecipeAction, usersAction } from '../../Redux/Actions/actions';

class RecipeDiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      ingredients: [],
      categories: []
    }
  }

  componentDidMount() {
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

  render() {
    const ingredients = this.state.ingredients.join(', ');
    const categories = this.state.categories.join(', ');

    return (
      <div className='recipe-div' >
        <Link to={`/recipe/${this.props.id}`}  >
          <div className='recipe-div-recipe'>
            <div className='recipe-div-text' >
              <h3>{this.props.name}</h3>
              <p>{this.props.description}</p>
              <div className='recipe-div-time' >
                <p>Preparation time: {this.props.time} minutes</p>
                <p>Ingredients: {ingredients}</p>
                <p>Categories: {categories}</p>
              </div>
            </div>

            {/* <div className="recipe-div-recipe-image" style={{backgroundImage: `url("${this.props.image}")`}}/>
            <div className="recipe-div-user-image" style={{backgroundImage: `url("${this.state.user.profile_pic}")`}}/> */}
            <div>
              <img className="recipe-div-recipe-image" src={this.props.image} alt={this.props.name} />
            </div>
          </div>
        </Link>
        <Link to={`/profile/${this.state.user.id}`}>
          <div className='recipe-div-user-image-div' >
            <img className="recipe-div-user-image" src={this.state.user.profile_pic} alt={this.state.user.username} />
          </div>
        </Link>
      </div>

    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ingredientsToRecipeAction, categoriesToRecipeAction, userToRecipeAction, usersAction }, dispatch);
}

export default connect(state => state, mapDispatchToProps)(RecipeDiv);