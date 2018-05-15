import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { resetRedux } from '../../Redux/Actions/actions';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    margin: 12,
  };

class RecipeButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipe: {},
        }
        this.addToFavorites = this.addToFavorites.bind(this);
    };

componentDidMount(){
    this.setState({
        recipe: this.props.childState.recipe,
    })
}

    addToFavorites(){
        axios.post('/api/favorite-recipes', {
          recipeId: this.state.recipe.id,
          userId: this.state.recipe.user.id,
        })
        .then(res => {
          this.setState({
            favorited: true
          })
        })
      }

    render(){
        if (this.props.viewedRecipe.favorited && this.props.viewedRecipe.canEdit) {
            return (
                <div className='recipe-buttons'>
                    <Link to={`/edit-recipe/${this.props.viewedRecipe.id}`} ><RaisedButton label='Edit' style={style} /></Link>
                    <RaisedButton label='Favorited' style={style} />
                </div>
            )
        }
        else if (this.props.viewedRecipe.favorited && !this.props.viewedRecipe.canEdit) {
            return (
                <div className='recipe-buttons'>
                    <RaisedButton label='Favorited' style={style} />
                </div>
            )
        }
        else if (!this.props.viewedRecipe.favorited && this.props.viewedRecipe.canEdit) {
            return (
                <div className='recipe-buttons'>
                     <Link to={`/edit-recipe/${this.props.viewedRecipe.id}`} ><RaisedButton label='Edit' style={style} /></Link>
                    <RaisedButton label='Add to Favorites' style={style} onClick={this.addToFavorites} />
                </div>
            )
        }
        else if (!this.props.viewedRecipe.favorited && !this.props.viewedRecipe.canEdit) {
            return (
                <div className='recipe-buttons'>
                    <RaisedButton label='Add to Favorites' style={style} onClick={this.addToFavorites} />
                </div>
            )
        }
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({resetRedux}, dispatch);
}

export default connect(state => state, mapDispatchToProps)(RecipeButtons);