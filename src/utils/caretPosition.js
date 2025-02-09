import { count, onlyDigits, removeSuffix } from './formatHelper'

export const setCaretPosition = (el, position) => el.setSelectionRange(position, position)

export const getCaretPositionAfterFormat = (el, inputtedValue, caretPosition) => {
  const { prefix, suffix, decimalSymbol, decimalLength, groupingSymbol } = el.$ci.currencyFormat
  const newValue = el.value
  const decimalSymbolPosition = inputtedValue.indexOf(decimalSymbol) + 1
  let caretPositionFromLeft = inputtedValue.length - caretPosition

  if (newValue === inputtedValue) {
    return caretPosition
  } else if (Math.abs(newValue.length - inputtedValue.length) > 1 && caretPosition <= decimalSymbolPosition) {
    return newValue.indexOf(decimalSymbol) + 1
  } else if (newValue.substr(caretPosition, 1) === groupingSymbol && count(newValue, groupingSymbol) === count(inputtedValue, groupingSymbol) + 1) {
    return newValue.length - caretPositionFromLeft - 1
  } else {
    if (decimalSymbolPosition !== 0 && caretPosition > decimalSymbolPosition) {
      if (onlyDigits(removeSuffix(inputtedValue.substr(decimalSymbolPosition), suffix)).length - 1 === decimalLength) {
        caretPositionFromLeft -= 1
      }
    }
    return el.$ci.options.hideCurrencySymbol
      ? newValue.length - caretPositionFromLeft
      : Math.max(newValue.length - Math.max(caretPositionFromLeft, suffix.length), prefix.length === 0 ? 0 : prefix.length + 1)
  }
}

export const getCaretPositionOnFocus = (el) => {
  let position = el.selectionStart
  const { prefix, groupingSymbol } = el.$ci.currencyFormat
  const { hideCurrencySymbol, hideGroupingSymbol } = el.$ci.options
  if (hideCurrencySymbol) {
    position -= prefix.length
  }
  if (hideGroupingSymbol) {
    position -= count(el.value.substring(0, el.selectionStart), groupingSymbol)
  }
  return Math.max(0, position)
}
