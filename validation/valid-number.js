const validNumber = num => {
  return /^\d*.?\d*$/.test(num);
}

module.exports = validNumber;