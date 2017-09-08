(function() {
  'use strict';

  angular
    .module('customFilters', [])
    .filter('Unique', Unique)
    .filter('Range', RangeFunc)
    .filter('PageCount', PageCount);

  function Unique() {
    return function(data, propertyName) {
      if (Array.isArray(data) && typeof propertyName === 'string') {
        let results = [];
        let keys = {};

        for (let i = 0; i < data.length; i++) {
          let val = data[i][propertyName];

          if (angular.isUndefined(keys[val])) {
            keys[val] = true;
            results.push(val);
          }
        }
        return results;
      } else {
        return data;
      }
    }
  }

  function RangeFunc($filter) {
    return function(data, page, size) {
      if (Array.isArray(data) && typeof page === 'number' && typeof size === 'number') {
        let start_index = (page -1) * size;

        if (data.length < start_index) {
          return [];
        } else {
          return $filter("limitTo")(data.splice(start_index), size);
        }
      } else {
        return data;
      }
    };
  };

  function PageCount() {
    return function(data, size) {
      if (Array.isArray(data)) {
        let result = [];
        for (let i = 0; i < Math.ceil(data.length / size); i++) {
          result.push(i);
        }
        return result;
      } else {
        return data;
      }
    };
  };
})();