export const setCurrenciesWordAction = (data) => {
  return {
    type: 'SET_CURRENCIES_WORD',
    currenciesWordList: data
  }
}
export const setConversionListAction = (data) => {
  return {
    type: 'SET_CONVERSION_LIST',
    listCurrencyConversion: data
  }
}
