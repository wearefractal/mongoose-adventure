module.exports = function(arr, fn) {
  var item;
  for (var i = 0; i < arr.length; i++) {
    item = arr[i];
    if (fn(item) === true) {
      return item;
    }
  }
};