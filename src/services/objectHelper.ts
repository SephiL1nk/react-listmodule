import _ from 'lodash'

function flattenObjectRecursive(object: any) {
    let toReturn: any = {};
    for (let i in object) {
        if (!object.hasOwnProperty(i)) continue;

        if ((typeof object[i]) === 'object' && object[i] !== null) {
            let flatObject = flattenObjectRecursive(object[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = object[i];
        }
    }

    return toReturn
}

function isFunction(possibleFunction: any) {
    return typeof (possibleFunction) === typeof (Function)
}

/*
* var person = { firstName: 'bill', lastName: 'johnson' }
* 
* person = _.rename(person, 'firstName', 'first')
* person = _.rename(person, 'lastName', 'last')
*
* console.log(person) // { first: 'bill', last: 'johnson' }
*/
function renameKey(obj: any, key: string, newKey: string) {
    if (_.includes(_.keys(obj), key)) {
        obj[newKey] = _.clone(obj[key]);
        delete obj[key]
    }
    return obj
}

/**
 *
 * @param {Object} obj
 * @param {boolean} strict
 *
 * Remove undefined and null keys values pairs in an object with recursive strategy
 * strict mode : remove also empty strings
 */
function removeEmpty(obj: any, strict: boolean = false) {
    const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

    Object.keys(o).forEach(key => {
        if (o[key] && typeof o[key] === 'object')
            o[key] = removeEmpty(o[key]);  // Recurse.
        else if (o[key] === undefined || o[key] === null || (strict && o[key] === ''))
            delete o[key]; // Delete undefined and null.
        else
            o[key] = o[key];  // Copy value.
    });

    return o; // Return new object.
}


export {flattenObjectRecursive, isFunction, renameKey, removeEmpty}