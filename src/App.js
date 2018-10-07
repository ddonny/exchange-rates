import React, { Component } from 'react';
import { connect } from 'react-redux';
/* component */
import Header from './components/Header';
import List from './components/List';
import Loader from './components/Loader';
import { setCurrenciesWordAction } from 'actions/globalActions';
/* style */
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: (props.shouldRequest) ? props.shouldRequest : true,
      baseAmountValue: props.globalReducer.baseAmount
    }
  }
  componentDidMount() {
    const {
      currenciesWordListComplete
    } = this.props.globalReducer;
    if (!currenciesWordListComplete) {
      // derived currencies word data from openexchangerates since not available on exchangeratesapi.io
      fetch("https://openexchangerates.org/api/currencies.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.props.setCurrenciesWordAction(result);
          this.setState({
            showLoading: false
          });
        },
        (error) => {
          this.setState({
            error: error
          });
        }
      )
    } else {
      this.setState({
        showLoading: false
      })
    }
  }
  callbackFunctionSendBaseAmountToParent = (baseAmountValue) => {
    // callback function for get value base amount after changed.
    this.setState({
      baseAmountValue: baseAmountValue
    });
  }
  render() {
    const {
      showLoading,
      baseAmountValue
    } = this.state;
    return (
      (showLoading) ?
      <div className="loader-wrapper">
        <Loader/>
      </div>
      :
      <div>
        <Header callbackFunctionSendBaseAmountToParent={this.callbackFunctionSendBaseAmountToParent}/>
        <List baseAmountAfterChangedProps={baseAmountValue}/>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state
})
const mapDispatchToProps = dispatch => ({
  setCurrenciesWordAction: (payload) => dispatch(setCurrenciesWordAction(payload))
})
// export default App;
// export default connect()(App);
export default connect(mapStateToProps, mapDispatchToProps)(App);