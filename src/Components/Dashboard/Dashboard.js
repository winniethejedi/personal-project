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
// import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';


const style = {
  margin: 12,
};
// const actions = [
//   <FlatButton
//     label="Cancel"
//     primary={true}
//     onClick={this.handleClose}
//   />,
//   <FlatButton
//     label="Submit"
//     primary={true}
//     keyboardFocused={true}
//     onClick={this.handleClose}
//   />,
// ];

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
      open: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.searchRecipes = this.searchRecipes.bind(this);
}

componentWillMount(){
  axios.get('/api/ingredients')
      .then(res=> {
        this.props.ingredientsAction(res.data);
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
  axios.get(`/api/favorite-recipes?id=${this.props.login.id}`, (req, res) => {

  })
}

componentDidMount(){
  this.setState({
    isLoaded: true
  })
}

handleOpen = () => {
  this.setState({open: true});
};

handleClose = () => {
  this.setState({open: false});
};


searchRecipes(){
  debugger;
  const recipes = this.props.allRecipes;
  const allIngredients = this.props.ingredients;
  let inputedIngredients = [];
  const time = parseInt(this.state.time, 10);
  const categories = this.state.categories;
  const foundRecipes= [];
  const inputedIngredientsKeys = [];
 
  inputedIngredients = this.refs.ingredients.value.split('\n');
  
  inputedIngredients.forEach((ingredient, i) => {
    if (ingredient === ''){
        inputedIngredients.splice(i, 1);
    }

    _.trim(ingredient);
    _.startCase(ingredient);
    const newIngredient = _.trim(ingredient);
    const newIngredient2 = _.startCase(newIngredient);
    return newIngredient2;
  });

  // if (inputedIngredients.length === 0){
  //   return (
  //     <div>
  //       <Dialog
  //         title="Dialog With Actions"
  //         actions={actions}
  //         modal={false}
  //         open={this.state.open}
  //         onRequestClose={this.handleClose}
  //       >
  //         The actions in this window were passed in as an array of React objects.
  //       </Dialog>
  //     </div>
  //   );
  // }

  if (inputedIngredients.length !== 0){

    const foundIngredientsKeys = allIngredients.filter((ingredient) => {
      let isThere = false;
      inputedIngredients.forEach((ing) => {
        if(ingredient.name === ing) {
          isThere = true;
          inputedIngredientsKeys.push(ingredient.id);
        }
      })
      return isThere;
    })

    const foundRecipesByIngredients = recipes.filter((recipe)=>{
      if(recipe.ingredientsIds && recipe.ingredientsIds.length > 0){
        let isThere = false;
        inputedIngredientsKeys.forEach((ingKey)=>{
          if(recipe.ingredientsIds.includes(ingKey)){
            isThere = true;
          }
        })
        return isThere;
      }
    })
    foundRecipes.push(...foundRecipesByIngredients);
  }
  if (time !== NaN){
    const foundRecipesByTime = foundRecipes.filter(recipe => {
      return parseInt(recipe.time, 10) <= time;
    })
     foundRecipes.push(...foundRecipesByTime);
  }
  if (categories.length !== 0 ){
    const foundRecipesByCategories = categories.map((category, i) => {
      foundRecipes.filter(recipe => {
        return recipe.categories.includes(category);
      })
    })
     foundRecipes.push(...foundRecipesByCategories);
  }

  this.props.searchRecipesAction(_.uniq(foundRecipes));

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