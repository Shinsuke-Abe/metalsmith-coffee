// Generated by CoffeeScript 1.7.1
(function() {
  var async, coffee, join, path;

  path = require('path');

  join = path.join;

  async = require('async');

  coffee = require('coffee-script');

  module.exports = function(options) {
    var convert, error, filter, name, output, regex, _i, _len, _ref;
    if (options == null) {
      options = {};
    }
    try {
      _ref = ["filter", "output"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        if (options[name] && typeof options[name] !== "function") {
          throw new Error("invalid option " + name + "! option " + name + " is not a function!");
        }
      }
    } catch (_error) {
      error = _error;
      console.log(error.message);
    }
    regex = coffee.FILE_EXTENSIONS.join("$|");
    regex = new RegExp(regex.replace(/\./g, "\\.") + "$", "g");
    filter = function(filepath) {
      return regex.test(filepath);
    };
    output = function(filepath) {
      return filepath.replace(regex, '.js');
    };
    convert = function(options, files, source, done) {
      var contents, data, err;
      data = files[source];
      if (!data || !data.contents) {
        return done(new Error('data does not exist'));
      }
      try {
        contents = coffee.compile(data.contents.toString(), options);
        files[(options.output || output)(source)] = {
          contents: new Buffer(contents)
        };
      } catch (_error) {
        err = _error;
        return done(err);
      }
      return done(null);
    };
    return function(files, metalsmith, done) {
      var err, paths;
      try {
        paths = Object.keys(files).filter(options.filter || filter);
      } catch (_error) {
        err = _error;
        return done(err);
      }
      return async.each(paths, convert.bind(null, options, files), function(err) {
        if (err) {
          return done(err);
        }
        if (!options.preserveSources) {
          paths.map(function(file) {
            return delete files[file];
          });
        }
        return done(null);
      });
    };
  };

}).call(this);