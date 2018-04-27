import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { allRecipesAction, searchRecipesAction, userRecipesAction, ingredientsAction } from '../../Redux/Actions/actions';
import Categories from '../Categories/Categories';
import RecipeDiv from '../RecipeDiv/RecipeDiv';
import Loading from '../Loading/Loading';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
}

class Dashboard extends Component {
  constructor(props){
    super(props)
    this.state = {
      categories: [],
      selectedCategories: [],
      ingredients: [],
      time: '',
      dbIngredients: [],
      isLoaded: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
    this.searchRecipes = this.searchRecipes.bind(this);
}

componentWillMount(){
  this.getRecipes();
  axios.get('/api/ingredients')
      .then(res=> {
        this.props.ingredientsAction(res.data);
      })
}

componentDidMount(){
  this.setState({
    isLoaded: true
  })
}

getRecipes(){
  this.setState({
    isLoaded: false
  })
     axios.get('/api/recipes',)
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

searchRecipes(){
  const ingredientsArray = [];
  const time = parseInt(this.state.time, 10);
  const categories = this.state.categories;

  if (this.refs.ingredients){
    ingredientsArray.push(this.refs.ingredients.value.split('\n'));
  }
  ingredientsArray.forEach((ingredient, i) => {
    if (ingredient === ''){
        ingredientsArray.splice(i, 1);
    }
  });
  // const ingredientsFilter = ingredientsArray.filter()

}

handleChange(e){
  this.setState({
      [e.target.name]: e.target.value,
  });
}


  render() {
    const recipes = [];
    if (this.props.searchRecipes.length === 0 ){
      recipes.push(this.props.userRecipes.map((recipe, i) => {
        return <RecipeDiv  key={recipe.id} id={recipe.id} name={recipe.name} description={recipe.description} time={recipe.time} categories={recipe.categories} image={recipe.image} user_id={recipe.user_id} ingredientsIds={recipe.ingredientsIds} categoriesIds={recipe.categoriesIds} />
        })
      ) 
    }
    else {
        recipes.push( this.props.searchRecipes.map((recipe, i) => {
          return <RecipeDiv  key={recipe.id} id={recipe.id} name={recipe.name} description={recipe.description} time={recipe.time} categories={recipe.categories} image={recipe.image} user_id={recipe.user_id} ingredientsIds={recipe.ingredientsIds} categoriesIds={recipe.categoriesIds}/>
          })
        )
    } 
    if (this.state.isLoaded){
      return (
        <div className='dashboard-page' >
          <Header/>
          <div className='dashboard-contents' >
            <h1>Dashboard</h1>
            <div className='search-contents'>
              <h2>Search</h2>
                <div className='search-parameters'>
                  <div className='dashboard-ingredients'>
                    <p>Ingredients</p>
                    <textarea placeholder='Ingredients (one ingredient per line)' id='ingredients' ref='ingredients'/>
                  </div>
                  <div className='dashboard-time' >
                    <p>Max Time to Prepare (in minutes)</p>
                    <input type="number" placeholder='Time' name ='time' value={this.state.time} onChange={this.handleChange} />
                  </div>
                  <div className='dashboard-categories' >
                    <Categories/>
                </div>
              </div>
              <div onClick={this.searchRecipes} className='dashboard-button'  ><RaisedButton label="Search" style={style} /></div>
            </div>
            <div className='recipes-contents'>
              <h2>Recipes</h2>
              {recipes}
            </div>
            <Link to='/add-recipe'>
              <div className='dashboard-button' >
                <RaisedButton label="Add Recipe" style={style} />
              </div>
            </Link>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <Header/>
          <Loading/>
        </div>
      )
    }
 
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({allRecipesAction, searchRecipesAction, userRecipesAction, ingredientsAction}, dispatch);
}

export default connect(state => state, mapDispatchToProps)(Dashboard);