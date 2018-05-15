import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import {categoriesCounterAddAction } from '../../Redux/Actions/actions';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
}

class AddCategory extends Component {
    constructor(props){
        super(props);
        this.clickAddCategory = this.clickAddCategory.bind(this);
    }    

    clickAddCategory(e){
        this.props.categoriesCounterAddAction();
    }

    render() {
      return (
          <div className='add-category-button' >
              <div onClick={this.clickAddCategory}><RaisedButton label='Add Category' style={style}/></div>
          </div>

      );
    }
  }
  
  function mapDispatchToProps(dispatch){
    return bindActionCreators({categoriesCounterAddAction}, dispatch);
}

  export default connect(state => state, mapDispatchToProps)(AddCategory);