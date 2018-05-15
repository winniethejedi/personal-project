import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { connect } from 'react-redux';
import Categories from '../Categories/Categories';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import Loading from '../Loading/Loading';

const style = {
    margin: 12,
  }

class AddRecipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            description: '',
            directions: '',
            time: '',
            image: '',
            categories: [],
            selectedCategories: [],
            dbIngredients: [],
            isLoaded: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }    

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

componentWillMount(){
    axios.get('/api/ingredients')
        .then(res=> {
            this.setState({
                dbIngredients: res.data
            })
        })
}

submitForm(e){
    this.setState({
        isLoaded: false
    })
    const ingredientsArray = this.refs.ingredients.value.split('\n');
    ingredientsArray.map((ingredient, i) => {
        if (ingredient === ''){
            ingredientsArray.splice(i, 1);
        }
        const newIngredient = _.trim(ingredient);
        const newIngredient2 = _.startCase(newIngredient);
        return newIngredient2;
    });
    axios.post('/api/recipe ', {
        name: this.state.name,
        description: this.state.description,
        ingredients: ingredientsArray,
        directions: this.state.directions,
        time: this.state.time,
        image: this.state.image,
        categories: this.props.categories,
        userId: this.props.login.id
    })
    .then((res)=>{
        this.setState({
            isLoaded: true
        })
        this.props.history.push('/dashboard');
    })
}

  render() {
    if (this.state.isLoaded) {
        return (
            <div className='add-recipe-page' >
                <Header/>
                <div className='add-recipe-contents' >
                    <h1>Add Recipe</h1>
                    <div className='add-recipe-input' >
                        <p>Name</p>
                        <input type="text" placeholder='Name' name='name' value={this.state.name} onChange={this.handleChange} />
                    </div>
                    <div className='add-recipe-image-contents' >
                        <div className='add-recipe-image' style={{backgroundImage: `url(${this.state.image})`}} alt='Preview' />
                        <p>Image URL</p>
                        <input type="text" placeholder='Image URL' name='image' value={this.state.image} onChange={this.handleChange}/>
                    </div>
                    <div className='add-recipe-input'>
                        <p>Description</p>
                        <input type="text" placeholder='Description' name='description' value={this.state.description} onChange={this.handleChange}/>
                    </div>
                    <div className='add-recipe-textarea'>
                        <p>Ingredients</p>
                        <textarea placeholder='Ingredients (one ingredient per line)' id='ingredients' ref='ingredients'/>
                    </div>
                    <div className='add-recipe-textarea'>
                        <p>Directions</p>
                        <textarea placeholder='Directions' name='directions' value={this.state.directions} onChange={this.handleChange}/>
                    </div>
                    <div className='add-recipe-input'>
                        <p>Time to Prepare (in minutes)</p>
                        <input type="number" name='time' value={this.state.time} onChange={this.handleChange}/>
                    </div>
                    <Categories/>
                    <RaisedButton onClick={this.submitForm} label="Submit" style = {style}/>
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

export default connect(state => state)(AddRecipe);