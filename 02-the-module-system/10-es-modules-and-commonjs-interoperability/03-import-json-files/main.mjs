import data from './sample.json' with {type: 'json'} // throw [ERR_IMPORT_ATTRIBUTE_MISSING] without `with {type: 'json'}`
// import text from './example.txt' with {type: 'text'}

console.log(data)
// console.log(text)
