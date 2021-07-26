/**
 * Takes a json object and creates a query formatted string
 *
 * @param {object} - a one level json object with the query options
 * @returns {string} a string in the form of 'key1=value1&key2=value2&...'
 */
export declare const objectToQString: (obj?: any) => string;
