import React, { Component } from 'react';
import Header from '../Header/Header';
import './AddRecipe.css';
import axios from 'axios';

class AddRecipe extends Component {
    constructor(props){
        super(props)
        this.state = {
            name: '',
            description: '',
            ingredients: [],
            directions: '',
            time: '',
            image: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }    

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    postRecipe(e){
        axios.post('/api/recipe ', {
            name: this.state.name,
            description: this.state.description,
            ingredients: [],
            directions: '',
            time: this.state.time,
            image: this.state.image
        })
        .then((res)=>{
            this.props.history.push('/dashboard');
        })
    }

  render() {
    return (
        <div className='add-recipe-page' >
            <Header/>
            <div className='add-recipe-contents' >
                <h1>Add Recipe</h1>
                <p>Name</p>
                <input type="text" placeholder='Name' name='name' value={this.state.name} onChange={this.handleChange} />
                <p>Description</p>
                <input type="text" placeholder='Description' name='description' value={this.state.description} onChange={this.handleChange}/>
                <p>Ingredients</p>
                <textarea placeholder='Ingredients'/>
                <p>Directions</p>
                <textarea placeholder='Directions' name='directions' value={this.state.directions} onChange={this.handleChange}/>
                <p>Time to Prepare (in minutes)</p>
                <input type="number" name='time' value={this.state.time} onChange={this.handleChange}/>
                <div className='add-recipe-image' style={{backgroundImage: `url(${this.state.image})`}} alt='Preview' />
                <p>Image URL</p>
                <input type="text" placeholder='Image URL' name='image' value={this.state.image} onChange={this.handleChange}/>
            </div>
        </div>
    );
  }
}

export default AddRecipe;