const Validator = require('validator');


const validNumber = require('./valid-number');
module.exports = function validateScoreInput(data){
  let errors = {};


  valueErrorStr = 'Value field must be numeric only!';
  // data.value = validNumber(data.value) ? data.value : '';
  if(!Validator.isInt(data.value)) {
    errors.text = valueErrorStr;
  }

  // Check this method later
  // if (!ValidatorValidator.isNumeric(data.value)){
  //   errors.text = valueErrorStr;
  // }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}