import React, { Component } from 'react';
import loading from '../Images/loading.svg';

class Loading extends Component {
    render(){
        return (
           <div className='loading' >
                <img src={ loading } alt="Loading"/>
           </div>
        )
    }
}
export default Loading;