const initialState = {
  baseAmount: '1.0000',
  baseCurrency: 'USD',
  listCurrencyConversion: [
    {
      currency: 'IDR'
    },
    {
      currency: 'EUR'
    },
    {
      currency: 'GBP'
    },
    {
      currency: 'SGD'
    }
  ]
}
export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CURRENCIES_WORD':
      return {...initialState, ...action}
    case 'SET_CONVERSION_LIST':
      return {...initialState, ...action}
   default:
    return state
  }
 }