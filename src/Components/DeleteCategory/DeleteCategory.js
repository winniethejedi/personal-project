import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import {categoriesCounterMinusAction } from '../../Redux/Actions/actions';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
}

class DeleteCategory extends Component {
    constructor(props){
        super(props);
        this.clickDeleteCategory = this.clickDeleteCategory.bind(this);
    }    

    clickDeleteCategory(e){
        this.props.categoriesCounterMinusAction();
    }

    render() {
      return (
          <div className='add-category-button' >
              <div onClick={this.clickDeleteCategory}><RaisedButton label='Delete Category' style={style}/></div>
          </div>

      );
    }
  }
  
  function mapDispatchToProps(dispatch){
    return bindActionCreators({categoriesCounterMinusAction}, dispatch);
}

  export default connect(state => state, mapDispatchToProps)(DeleteCategory);