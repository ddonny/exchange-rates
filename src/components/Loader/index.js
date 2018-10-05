import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.css';

class Loader extends Component {
  render() {
    return (
      <div className="loader"></div>
    );
  }
}
const mapStateToProps = state => ({
  ...state
})
export default connect(mapStateToProps)(Loader);