import _ from 'lodash'

/**
 * Check if null, undefined and empty keys are in the object and delete the keys accordingly;
 */
const deleteEmptyKeys = (object: any) => {
    _.map(object, (value, key) => {
        if (_.isNil(value) || value.length === 0) {
            delete object[key]
        }
    });

    return object
};

const filterByRegex = (item: any, regex: string | RegExp) => {
    let result = item.match(regex);
    return !_.isNil(result) ? result[0] : null
};

const filterObjectKeyByRegex = (object: any, regex: string | RegExp) => {
    let newObject = {};
    _.map(object, (value, key) => {
        newObject = {...{[filterByRegex(key, regex)]: value}}
    });

    return newObject
};

export {deleteEmptyKeys, filterByRegex, filterObjectKeyByRegex}