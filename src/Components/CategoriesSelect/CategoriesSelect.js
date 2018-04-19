import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { categoriesAction} from '../../Redux/Actions/actions';

class CategoriesSelect extends Component {
    constructor(props){
        super(props)
        this.state = {
          categories: [],
        }
        this.clickCategory = this.clickCategory.bind(this);
    }

    componentWillMount(){
        this.getCategories();
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
        if (this.props.categories.includes(e.target.value) === false ){
            this.props.categoriesAction(e.target.value);
        };
    };

    render() {
        const categories = this.state.categories.map((category, i) => {
            return <option value={category.id} key={category.id} >{category.name}</option>
          })
      
      return (
          <div className='categories-select' >
              <p>Select Category</p>
              <select onChange={this.clickCategory} value={this.state.value} >
                  {categories}
              </select>
          </div>

      );
    }
  }
  
  function mapDispatchToProps(dispatch){
    return bindActionCreators({categoriesAction}, dispatch);
}

  export default connect(state => state, mapDispatchToProps)(CategoriesSelect);