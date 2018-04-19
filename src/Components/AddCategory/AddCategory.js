import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import {categoriesCounterAction } from '../../Redux/Actions/actions';

class CategoriesSelect extends Component {
    constructor(props){
        super(props);
        this.clickAddCategory = this.clickAddCategory.bind(this);
    }    

    clickAddCategory(e){
        this.props.categoriesCounterAction();
    }

    render() {
      return (
          <div className='add-category-button' >
              <button onClick={this.clickAddCategory} >Add Category</button>
          </div>

      );
    }
  }
  
  function mapDispatchToProps(dispatch){
    return bindActionCreators({categoriesCounterAction}, dispatch);
}

  export default connect(state => state, mapDispatchToProps)(CategoriesSelect);