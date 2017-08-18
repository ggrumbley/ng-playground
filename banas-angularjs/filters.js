angular
  .module('weatherFilters', [])
  .filter('raining', rainingFilter);

function rainingFilter() {
  return function(input) {
    return input ? '\u2602' : '\u2600';
  };
};