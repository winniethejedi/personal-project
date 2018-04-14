import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import axios from 'axios';
import './Dashboard.css';

const selectedCategories = [];

class Dashboard extends Component {
  constructor(props){
    super(props)
    this.state = {
      categories: [],
      selectedCategories: [],
      ingredients: [],
      time: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.clickCategory = this.clickCategory.bind(this);
}

handleChange(e){
  this.setState({
      [e.target.name]: e.target.value,
  });
}

getCategories(){
  axios.get('api/categories')
    .then(res => {
      this.setState({
        categories: res.data
      });
    });
};

clickCategory(e){
  if (selectedCategories.includes(e.target.value) === false ){
    selectedCategories.push(e.target.value);
  };
};

componentWillMount(){
  this.getCategories();
}

  render() {
    const categories = this.state.categories.map((category, i) => {
      return <option value={category.name} key={i} >{category.name}</option>
    })

    return (
      <div className='dashboard-page' >
        <Header/>
        <div className='dashboard-contents' >
          <h1>Dashboard</h1>
          <div className='search-contents'>
            <h2>Search</h2>
            <p>Ingredients</p>
            <textarea placeholder='Ingredient'/>
            <p>Max Time to Prepare (in minutes)</p>
            <input type="number" placeholder='Time' name ='time' value={this.state.time} onChange={this.handleChange} />
            <p>Select Category</p>
            <select onChange={this.clickCategory} value={this.state.value} >
              {categories}
            </select>
            <button>Add Category</button>
            <button>Search</button>
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

export default Dashboard;