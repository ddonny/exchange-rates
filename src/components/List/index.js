import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { 
  ListGroup, 
  ListGroupItem, 
  Button,
  UncontrolledDropdown, 
  DropdownToggle, 
  DropdownMenu, 
  DropdownItem
} from 'reactstrap';
import Loader from 'components/Loader';
import { setConversionListAction } from 'actions/globalActions';
import queryString from 'query-string';
import accounting from 'accounting';
import './style.css';

class List extends Component {
  constructor (props) {
    super(props);
    // initial are set to IDR, EUR, GBP and SGD as instructions in initial state
    this.state = {
      listCurrencyConversion: props.globalReducer.listCurrencyConversion,
      showSelectionForAddMoreCurrencies: true,
      addNewCurrency: false,
      baseAmount: props.globalReducer.baseAmount,
      baseCurrency: props.globalReducer.baseCurrency,
      baseCurrencyWords: props.globalReducer.currenciesWordList[props.globalReducer.baseCurrency],
      conversionListDataComplete: false, // flag for currency rates from current list
      listAvailableCurrencyToAdd: [],
      currenciesWordList: props.globalReducer.currenciesWordList
    }
  }
  componentDidMount() {
    // get rates by 1 unit base currency
    this.requestConversionBaseOnOneUnit();
  }
  shouldComponentUpdate(nextProps, nextState) {
    // check if current base amount props is not same with base amount props after changed, and trigger it for re-calculate
    if (nextProps.baseAmountAfterChangedProps !== this.props.baseAmountAfterChangedProps) {
      this.setState({
        baseAmount: nextProps.baseAmountAfterChangedProps
      });
    }
    return true;
  }
  requestConversionBaseOnOneUnit = () => {
    const {
      baseCurrency
    } = this.state;
    let params = {
      base: baseCurrency
    };
    // derived data exchange from // https://api.exchangeratesapi.io/latest?base=USD
    fetch("https://api.exchangeratesapi.io/latest?" + queryString.stringify(params))
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            resultConversion: result
          }, () => {
            // build list with exclude base currency, and on current list currency
            this.buildAvailableTargetCurrencyForAddToList()
          });
        },
        (error) => {
          this.setState({
            error: error
          });
        }
      )
  }
  buildAvailableTargetCurrencyForAddToList = () => {
    const {
      resultConversion
    } = this.state;
    const { 
      listCurrencyConversion 
    } = this.props.globalReducer;
    let listExceptionCurrencyToAdd = [];
    // base currency not set to exception lists
    // listExceptionCurrencyToAdd.push(baseCurrency);
    for (let index in listCurrencyConversion) {
      listExceptionCurrencyToAdd.push(listCurrencyConversion[index]['currency']);
    }
    let listAvailableCurrencyToAdd = [];
    for (let currencyCode in resultConversion.rates) {
      if (listExceptionCurrencyToAdd.indexOf(currencyCode) === -1) {
        listAvailableCurrencyToAdd.push(currencyCode);
      }
    }
    this.setState({
      listAvailableCurrencyToAdd: listAvailableCurrencyToAdd,
      conversionListDataComplete: true
    });
  }
  showSelectionForAddMoreCurrencies = () => {
    this.setState({showSelectionForAddMoreCurrencies: true});
  }
  addNewCurrency = (currency) => {
    this.setState({addNewCurrency: currency})
  }
  deleteFromConversionList = (currency) => {
    const { 
      listCurrencyConversion,
    } = this.props.globalReducer;
    const {
      listAvailableCurrencyToAdd
    } = this.state;
    let newArrayOfListCurrencyConversion = listCurrencyConversion;
    for (let index in newArrayOfListCurrencyConversion) {
      if (newArrayOfListCurrencyConversion[index]['currency'] === currency) {
        newArrayOfListCurrencyConversion.splice(index, 1);
      }
    }
    const tempListAvailableCurrencyToAdd = listAvailableCurrencyToAdd;
    tempListAvailableCurrencyToAdd.push(currency);
    this.setState({
      listAvailableCurrencyToAdd: tempListAvailableCurrencyToAdd
    }, () => {
      this.props.setConversionListAction(newArrayOfListCurrencyConversion);
    });
  }
  commitAddNewConversionTarget = () => {
    const {
      addNewCurrency,
      listCurrencyConversion
    } = this.state;
    if (addNewCurrency) {
      // add new currency target to list
      let newCurrencyTarget = {
        currency: addNewCurrency 
      };
      listCurrencyConversion.push(newCurrencyTarget);
      this.setState({
        listCurrencyConversion: listCurrencyConversion,
        addNewCurrency: false
      }, () => {
        this.buildAvailableTargetCurrencyForAddToList();
      })
    }
  }
  returnAddNewCurrenciesElement = () => {
    const {
      showSelectionForAddMoreCurrencies,
      addNewCurrency,
      listAvailableCurrencyToAdd
    } = this.state;
    return (
      (showSelectionForAddMoreCurrencies) ?
        <div className="selections-add-more-conversion">
          <UncontrolledDropdown>
            <DropdownToggle caret>
              {
                (addNewCurrency) ?
                  'Selected: ' + addNewCurrency
                :
                  'Choose Currency'
              }
            </DropdownToggle>
            <DropdownMenu
              modifiers={{
                setMaxHeight: {
                  enabled: true,
                  fn: (data) => {
                    return {
                      ...data,
                      styles: {
                        ...data.styles,
                        overflow: 'auto',
                        maxHeight: 200,
                      },
                    };
                  },
                },
              }}
            >
              {
                listAvailableCurrencyToAdd.map((item, index) =>
                  <DropdownItem key={item} onClick={() => {this.addNewCurrency(item)}}>{item}</DropdownItem>    
                )
              }
            </DropdownMenu>
          </UncontrolledDropdown>
          <Button className="submit" color="secondary" onClick={this.commitAddNewConversionTarget}>Submit</Button>
        </div>
      :
        <div className="button-add-more-conversion" onClick={this.showSelectionForAddMoreCurrencies}>
          <Button color="default">+ Add More Currencies</Button>
        </div>
    )
  }
  returnConversionResultByCurrencyCode = (currencyCode, withoutDivWrapper) => {
    const {
      resultConversion,
      baseAmount
    } = this.state;
    // conversion rate base on 1 unit, e.g. : 1 USD
    const per1Unit = resultConversion.rates[currencyCode];
    // calculate by rate base on 1 unit with input amount
    // unformat first base amount
    let unformatBaseAmount = accounting.unformat(baseAmount);
    let conversionRate = Number(unformatBaseAmount) * Number(per1Unit);
    // format conversionRate result with 4 precision.
    let formatTo4Precision = accounting.formatNumber(conversionRate, 4, ',', '.');
    if (withoutDivWrapper) {
      return (
        formatTo4Precision
      )
    } else {
      return (
        <div>
          {
            formatTo4Precision
          }
        </div>
      )
    }
  }
  render() {
    const {
      listCurrencyConversion,
      baseAmount,
      baseCurrency,
      conversionListDataComplete,
      currenciesWordList
    } = this.state;
    return (
      (!listCurrencyConversion) ?
      null
      :
      (listCurrencyConversion.length === 0) ?
      <div className="list-wrapper">
        <div className="message">No Conversion Destination Data</div>
        {
          this.returnAddNewCurrenciesElement()
        }
      </div>
      :
      <div className="list-wrapper">
        <ListGroup>
        {
          listCurrencyConversion.map( (item, idx) => 
            <ListGroupItem key={idx}>
              <div className="conversion-wrapper">
                <div className="conversion-section-1">
                  <div className="area-1">
                    <div className="currency">{item.currency}</div>
                    <div className="amount-conversion">
                      {
                        (conversionListDataComplete) ?
                          this.returnConversionResultByCurrencyCode(item.currency)
                        :
                        <Loader/>
                      }
                    </div>
                  </div>
                  <div className="area-2">
                    <div className="info">{item.currency} {'-'} {currenciesWordList[item.currency]}</div>
                  </div>
                  <div className="area-3">
                      {
                        (conversionListDataComplete) ?
                          <div className="info">{baseAmount} {' '} {baseCurrency} {' = '} {item.currency} {' '} {this.returnConversionResultByCurrencyCode(item.currency, true)}</div>
                        :
                        <Loader/>
                      }
                  </div>
                </div>
                <div className="conversion-section-2" onClick={() => {this.deleteFromConversionList(item.currency)}}>
                  <Button color="danger">-</Button>
                </div>
              </div>
            </ListGroupItem>
          )
        }
        </ListGroup>
        {
          this.returnAddNewCurrenciesElement()
        }
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state
})
const mapDispatchToProps = dispatch => ({
  setConversionListAction: (payload) => dispatch(setConversionListAction(payload))
})
List.propTypes = {
  baseAmountAfterChangedProps: PropTypes.any
}
export default connect(mapStateToProps, mapDispatchToProps)(List);