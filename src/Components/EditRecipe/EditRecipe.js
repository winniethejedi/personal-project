import React, { Component } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { connect } from 'react-redux';
import * as Actions from '../../Redux/Actions/actions';
import Categories from '../Categories/Categories';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import Loading from '../Loading/Loading';

const style = {
    margin: 12,
  }

class EditRecipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: '',
            isLoaded: true
        }
        this.submitForm = this.submitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }    

handleChange(e){
    this.setState({
        [e.target.name]: e.target.value,
    });
};

componentDidMount() {
    if (this.props.allRecipes.length === 0 || this.props.login.id !== this.props.viewedRecipe.user_id ) {
        this.props.history.push('/dashboard')
    }
    else {
        this.refs.name.value = this.props.viewedRecipe.name ? this.props.viewedRecipe.name : '';
        this.refs.description.value = this.props.viewedRecipe.description ? this.props.viewedRecipe.description : '';
        this.refs.ingredients.value = this.props.viewedRecipe.ingredients ? this.props.viewedRecipe.ingredients.join('\n') : '';
        this.refs.directions.value = this.props.viewedRecipe.directions ? this.props.viewedRecipe.directions : '';
        this.refs.time.value = this.props.viewedRecipe.time ? this.props.viewedRecipe.time : '';
        this.setState({
            image: this.props.viewedRecipe.image ? this.props.viewedRecipe.image : ''
        });
    }
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
    axios.put('/api/recipe', {
        id: this.props.viewedRecipe.id,
        name: this.refs.name.value,
        description: this.refs.description.value,
        ingredients: ingredientsArray,
        directions: this.refs.directions.value,
        time: this.refs.time.value,
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
            <div className='edit-recipe-page' >
                <Header/>
                <div className='edit-recipe-contents' >
                    <h1>Edit Recipe</h1>
                    <div className='edit-recipe-input' >
                        <p>Name</p>
                        <input type="text" placeholder='Name' name='name' ref='name'  />
                    </div>
                    <div className='edit-recipe-image-contents' >
                        <div className='edit-recipe-image' style={{backgroundImage: `url(${this.state.image})`}} alt='Preview' />
                        <p>Image URL</p>
                        <input type="text" name='image' value={this.state.image}  onChange={this.handleChange} />
                    </div>
                    <div className='edit-recipe-input'>
                        <p>Description</p>
                        <input type="text" placeholder='Description' name='description' ref='description' />
                    </div>
                    <div className='edit-recipe-textarea'>
                        <p>Ingredients</p>
                        <textarea placeholder='Ingredients (one ingredient per line)' id='ingredients' ref='ingredients'/>
                    </div>
                    <div className='edit-recipe-textarea'>
                        <p>Directions</p>
                        <textarea placeholder='Directions' name='directions' ref='directions' />
                    </div>
                    <div className='edit-recipe-input'>
                        <p>Time to Prepare (in minutes)</p>
                        <input type="number" name='time' ref='time' />
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

export default connect(state => state)(EditRecipe);