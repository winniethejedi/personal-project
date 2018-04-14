import React, { Component } from 'react';
import './Register.css';
import axios from 'axios';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { loginAction } from '../../Redux/Actions/actions';

class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password:"",
            username: '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    register(e){
        const profilePic = `https://robohash.org/${ this.state.username }.png`;
        if (this.state.email === '') {
            return alert('Must enter email');
        }
        else if (this.state.password === '') {
            return alert('Must enter password');
            }
        else if (this.state.username === '') {
            return alert('Must enter username');
        }
        else
        axios.post(`/api/auth/register`, {email: this.state.email, password: this.state.password, username: this.state.username, profile_pic: profilePic})
            .then((response)=>{
                if(response.data.success){
                    this.props.loginAction({
                        email: response.data.email,
                        username: response.data.username,
                        profile_pic: response.data.profile_pic,
                        id: response.data.id
                    })
                    this.props.history.push('/dashboard');
                }else{
                    alert("That username or email is already registered")
                }
            })
            .catch((err)=>{
                console.log(err)
            }) 
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    render(){
        return (
            <div className='register-page' >
                <div className='register-contents' >              
                    <div className='input-box' >
                        <h3>Username</h3>
                        <input name="username" value={this.state.username} onChange={this.handleChange} type="text"/>
                    </div>
                    <div className='input-box' >
                        <h3>Email</h3>
                        <input name="email" value={this.state.email} onChange={this.handleChange} type="text"/>
                    </div>
                    <div className='input-box' >
                        <h3>Password</h3>
                        <input name="password" value={this.state.password} onChange={this.handleChange} type="password"/>
                    </div>
                    <div className='register-buttons'>
                        <div onClick={(event)=>{this.register(event)}} className='dark-green-button'><button>Register</button></div>
                    </div>
                 </div>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({loginAction}, dispatch);
}
export default connect(state => state, mapDispatchToProps)(withRouter(Register));