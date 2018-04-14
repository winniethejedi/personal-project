import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import './Header.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { resetRedux } from '../../Redux/Actions/actions';

class Header extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    };

    logout() {
        axios.post('/api/auth/logout');
        this.props.resetRedux();
    };

    render(){
        return (
           <div className='header' >
                <div className='header-left-side' >
                    <h1>App Name</h1>
                </div>
                <div className='header-right-side' >
                    <Link to={`/profile/${this.props.loginReducer.id}`} >
                        <p>{this.props.loginReducer.username}</p>
                        <img id='header-profile-pic' src={this.props.loginReducer.profile_pic} alt={this.props.loginReducer.username}/>
                    </Link>
                    <Link to='/'> <div onClick={this.logout}><p>Logout</p></div></Link>
                </div>
           </div>
        )
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({resetRedux}, dispatch);
}

export default connect(state => state, mapDispatchToProps)(Header);