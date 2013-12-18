var ElasticSearchClient = require('elasticsearchclient')
  , url = require('url')
  , _ = require('lodash')
  , configES = require('../config').elasticsearch;

var ElasticSearch = function() {
  var connectionString = url.parse(configES.url);
  var serverOptions = {
    host: connectionString.hostname,
    path: connectionString.pathname,
    auth: {
      username: connectionString.auth.split(':')[0],
      password: connectionString.auth.split(':')[1]
    }
  };

  var esClient = new ElasticSearchClient(serverOptions)
    , index = configES.index
    , type = configES.type;

  return {
    insert: function(array) {
      _.each(array, function(data) {
        var id = data.id;
        data = _.omit(data, 'id');

        esClient
          .index(index, type, data, id)
          .on('data', function(data) {
            console.log(data);
          })
          .exec();
      });
    }
  }
};

module.exports = ElasticSearch;
