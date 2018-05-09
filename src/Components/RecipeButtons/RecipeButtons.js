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
            canEdit: false,
            favorited: false,
        }
        this.addToFavorites = this.addToFavorites.bind(this);
    };

componentDidMount(){
    this.setState({
        recipe: this.props.childState.recipe,
        canEdit: this.props.childState.canEdit,
        favorited: this.props.childState.favorited,
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
        if (this.state.favorited && this.state.canEdit) {
            return (
                <div className='recipe-buttons'>
                    <RaisedButton label='Edit' style={style} />
                    <RaisedButton label='Favorited' style={style} />
                </div>
            )
        }
        else if (this.state.favorited && !this.state.canEdit) {
            return (
                <div className='recipe-buttons'>
                    <RaisedButton label='Favorited' style={style} />
                </div>
            )
        }
        else if (!this.state.favorited && this.state.canEdit) {
            return (
                <div className='recipe-buttons'>
                    <RaisedButton label='Edit' style={style} />
                    <RaisedButton label='Add to Favorites' style={style} onClick={this.addToFavorites} />
                </div>
            )
        }
        else if (!this.state.favorited && !this.state.canEdit) {
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