import React, { Component } from 'react';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Register from '../Register/Register';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { loginAction } from '../../Redux/Actions/actions';


class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password:"",
            open: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    login(e){
        axios.post(`/api/auth/login`, {email:this.state.email, password:this.state.password})
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
                    alert("Your email or password is incorrect")
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

    handleOpen = () => {
        this.setState({open: true});
      };
    
    handleClose = () => {
        this.setState({open: false});
    };

    render(){
        // const actions = [
        //     <FlatButton
        //       label="Cancel"
        //       primary={true}
        //       onClick={this.handleClose}
        //     />,
        //     <FlatButton
        //       label="Submit"
        //       primary={true}
        //       onClick={this.handleClose}
        //     />,
        //   ];
        return (
            <div className='login-page' >
                <div className='sidebar' ></div>
                <div className='login-contents' >              
                    <div className='input-box' >
                        <h3>Email</h3>
                        <input name="email" value={this.state.email} onChange={this.handleChange} type="text"/>
                    </div>
                    <div className='input-box' >
                        <h3>Password</h3>
                        <input name="password" value={this.state.password} onChange={this.handleChange} type="password"/>
                    </div>
                    <div className='login-buttons'>
                        <div><RaisedButton label='Login' onClick={(event)=>{this.login(event)}}/></div>
                        <div>
                            <RaisedButton label='register' onClick={this.handleOpen}/>
                            <Dialog
                                title="Register"
                                modal={false}
                                open={this.state.open}
                                onRequestClose={this.handleClose}
                            >
                                <Register/>
                            </Dialog>
                        </div>
                    </div>
                 </div>
                <div className='sidebar' ></div>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({loginAction}, dispatch);
}

export default connect(state => state, mapDispatchToProps)(Login);