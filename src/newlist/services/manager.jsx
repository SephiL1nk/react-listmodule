import _ from 'lodash'

/**
 * Check if null, undefined and empty keys are in the object and delete the keys accordingly;
 */
const deleteEmptyKeys = (object) => {
  _.map(object, (value, key) => {
    if (_.isNil(value) || value.length === 0) {
      delete object[key]        
    }
  })

  return object
}

const filterByRegex = (item, regex) => {
  return regex.exec(item)[0]
}

export { deleteEmptyKeys, filterByRegex } 