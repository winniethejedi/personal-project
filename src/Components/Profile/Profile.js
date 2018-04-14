import React, { Component } from 'react';
import Header from '../Header/Header';
import { connect } from 'react-redux';
import './Profile.css';

class Profile extends Component {
  render() {
    if (parseInt(this.props.match.params.userid, 10)  ===  this.props.loginReducer.id) {
      return (
        <div>
          <Header/>
          <img className='profile-pic' src={this.props.loginReducer.profile_pic} alt={this.props.loginReducer.username}/>
          <h1>My Profile</h1>
          <h2>My Recipes</h2>
          <h2>Favorite Recipes</h2>
          <h2>Following</h2>
          <h2>Followers</h2>
        </div>
      );
    }
    else return (
      //figure out how to access others' profiles
      <div>
        <Header />
        <img className='profile-pic' src={this.props.loginReducer.profile_pic} alt={this.props.loginReducer.username} />
        <h1>{this.props.loginReducer.username}'s Profile</h1>
        <h2>{this.props.loginReducer.username}'s Recipes</h2>
        <h2>Favorite Recipes</h2>
        <h2>Following</h2>
        <h2>Followers</h2>
      </div>
    )

  }
}

export default connect(state => state)(Profile);