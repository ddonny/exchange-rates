export const setCurrenciesWordAction = (data) => dispatch => {
  dispatch({
   type: 'SET_CURRENCIES_WORD',
   currenciesWordList: data
  })
}
export const setConversionListAction = (data) => dispatch => {
  dispatch({
   type: 'SET_CONVERSION_LIST',
   listCurrencyConversion: data
  })
}
