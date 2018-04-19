import React, { Component } from 'react';
import Header from '../Header/Header';
import { connect } from 'react-redux';

class Profile extends Component {
  render() {
    if (parseInt(this.props.match.params.userid, 10)  ===  this.props.login.id) {
      return (
        <div>
          <Header/>
          <img className='profile-pic' src={this.props.login.profile_pic} alt={this.props.login.username}/>
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
        <img className='profile-pic' src={this.props.login.profile_pic} alt={this.props.login.username} />
        <h1>{this.props.login.username}'s Profile</h1>
        <h2>{this.props.login.username}'s Recipes</h2>
        <h2>Favorite Recipes</h2>
        <h2>Following</h2>
        <h2>Followers</h2>
      </div>
    )

  }
}

export default connect(state => state)(Profile);