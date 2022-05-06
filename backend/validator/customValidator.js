// for useModel password field extra validation process
function passWordValidator(value) {
  if (value !== value.toLocaleLowerCase() && /\d/.test(value)) {
    return true;
  }
  if (value === value.toLocaleLowerCase()) {
    return false;
  }
  if (!/\d/.test(value)) {
    return false;
  }
  return false;
}

export { passWordValidator };
