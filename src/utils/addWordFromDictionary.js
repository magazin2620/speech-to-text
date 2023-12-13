import { dictionary } from '../data/dictionary.js'

export function addWordFromDictionary(s) {

  return s
    .split(' ')
    .map((word) => {
      if (!dictionary[word.toLowerCase()]) return word
      return dictionary[word.toLowerCase()]
    })
    .join(' ')
}