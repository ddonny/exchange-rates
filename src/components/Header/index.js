import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { 
  Input
} from 'reactstrap';
import accounting from 'accounting';
import CurrencyFormat from 'react-currency-format';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './style.css';

library.add(faPencilAlt, faTimesCircle)
class Header extends Component {
  constructor (props) {
    super(props);
    // initial are set to USD as instructions in initial state
    this.state = {
      baseAmount: props.globalReducer.baseAmount,
      baseCurrency: props.globalReducer.baseCurrency,
      baseCurrencyWords: props.globalReducer.currenciesWordList[props.globalReducer.baseCurrency]
    }
    this.inputElem = React.createRef()
  }
  componentWillMount() {
    this._refs = {};
  }
  onValueChangeBaseAmount = (values) => {
    // value => raw value from input
    // formattedValue => contain formatted value from input
    const { formattedValue } = values;
    const { callbackFunctionSendBaseAmountToParent } = this.props;
    this.setState({
      baseAmount: formattedValue
    }, () => {
      // type checking
      if (typeof callbackFunctionSendBaseAmountToParent === 'function') {
        callbackFunctionSendBaseAmountToParent(formattedValue)
      }
    })
  }
  setEdit = (value) => {
    this.setState({editBaseAmount: value}, () => {
      setTimeout(() => {
        if (value && this._refs[`inputElem`]) {
          this._refs[`inputElem`].focus();
          // alternative to set focus
          // document.getElementById('base-amount-field-input').focus();
        }
      }, 50);
    });
  }
  onBlurInput = () => {
    const {
      baseAmount
    } = this.state;
    let unformattedBaseAmount = accounting.unformat(baseAmount);
    let formatTo4Precision = accounting.formatNumber(unformattedBaseAmount, 4, ',', '.');
    this.setState({baseAmount: formatTo4Precision});
    this.setEdit(false);
  }
  render() {
    const {
      baseAmount,
      baseCurrency,
      baseCurrencyWords,
      editBaseAmount
    } = this.state;
    return (
      <div className="header-wrapper">
        <div className="d-flex wrapper-1">
          <div className="text-1">{baseCurrency + ' - ' + baseCurrencyWords}</div>
        </div>
        <div className="d-flex align-items-center wrapper-2">
          <div className={(editBaseAmount) ? 'text-2 edit' : 'text-2'}>{baseCurrency}</div>
          {
            (editBaseAmount) ?
              <div className="input-base-amount">
                <FontAwesomeIcon onClick={() => { this.setEdit(false) }} icon="times-circle" className="icon-close" />
                <CurrencyFormat ref = {(inst) => this._refs[`inputElem`] = ReactDOM.findDOMNode(inst)} id="base-amount-field-input" customInput={Input} value={baseAmount} thousandSeparator={','} decimalSeparator={'.'} prefix={''} onValueChange={this.onValueChangeBaseAmount} onBlur={this.onBlurInput}/>
              </div>
            :
              <div>
                <span className="base-amount-not-edit" onClick={() => { this.setEdit(true) }}>{baseAmount}</span>
                <FontAwesomeIcon onClick={() => { this.setEdit(true) }} icon="pencil-alt" className="icon-edit" />
              </div>
          }
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state
})
Header.propTypes = {
  callbackFunctionSendBaseAmountToParent: PropTypes.func
}
export default connect(mapStateToProps)(Header);