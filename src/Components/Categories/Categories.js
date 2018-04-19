import React, { Component } from 'react';
import { connect } from 'react-redux';
import CategoriesSelect from '../CategoriesSelect/CategoriesSelect';
import AddCategory from '../AddCategory/AddCategory';

class Categories extends Component {
    render() {
    const categorySelectors = [];
    for (let i = 0; i < this.props.categoriesCounter; i++){
        categorySelectors.push(<CategoriesSelect key={i} />)
    }
      return (
          <div className='categories' >
            {categorySelectors}
            <AddCategory/>
          </div>

      );
    }
  }

  export default connect(state => state)(Categories);