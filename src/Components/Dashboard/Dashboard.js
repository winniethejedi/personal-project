import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { searchRecipesAction, ingredientsAction } from '../../Redux/Actions/actions';
import Categories from '../Categories/Categories';

class Dashboard extends Component {
  constructor(props){
    super(props)
    this.state = {
      categories: [],
      selectedCategories: [],
      ingredients: [],
      time: '',
      dbIngredients: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.getRecipes = this.getRecipes.bind(this);
}

componentWillMount(){
  this.getRecipes();
  axios.get('/api/ingredients')
      .then(res=> {
        this.props.ingredientsAction(res.data);
      })
}

getRecipes(){
  if (!this.refs.ingredients){
    axios.post('/api/recipes', {
      time: this.state.time,
      categories: this.props.categories
    })
    .then(res => {
      this.props.searchRecipesAction(res.data);
    })
  }
  else () => {
    const ingredientsArray = this.refs.ingredients.value.split('\n');
    ingredientsArray.map((ingredient, i) => {
        if (ingredient === ''){
            ingredientsArray.splice(i, 1);
        }
    });
     axios.post('/api/recipes', {
      ingredients: ingredientsArray,
      time: this.state.time,
      categories: this.props.categories
    })
      .then(res => {
        this.props.searchRecipesAction(res.data);
      })
  } 
}

handleChange(e){
  this.setState({
      [e.target.name]: e.target.value,
  });
}

  render() {
    return (
      <div className='dashboard-page' >
        <Header/>
        <div className='dashboard-contents' >
          <h1>Dashboard</h1>
          <div className='search-contents'>
            <h2>Search</h2>
            <p>Ingredients</p>
            <textarea placeholder='Ingredients' id='ingredients' ref='ingredients'/>
            <p>Max Time to Prepare (in minutes)</p>
            <input type="number" placeholder='Time' name ='time' value={this.state.time} onChange={this.handleChange} />
            <Categories/>
            <button onClick={this.getRecipes} >Search</button>
          </div>
          <div className='recipes-contents'>
            <h2>Recipes</h2>
          </div>
          <Link to='/add-recipe'>
            <div className='add-recipe-dashboard'>
              <h2>Add your own recipe!</h2>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch){
  return bindActionCreators({searchRecipesAction, ingredientsAction}, dispatch);
}

export default connect(state => state, mapDispatchToProps)(Dashboard);