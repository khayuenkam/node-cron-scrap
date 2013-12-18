"use strict";

var cheerio = require('cheerio')
  , Promise = require('bluebird')
  , request = Promise.promisify(require('request'))
  , configHb = require('../config').hypebeast
  , esClient = require('./elasticsearch');

var Hypebeast = function() {
  var url = configHb.url
    , name = configHb.name
    , ES = esClient();

  return {
    start: function() {
      var targetUrl = [url, 'news'].join('');
      
      request(targetUrl)
      .spread(function(response, body) {
        return body;
      })
      .then(this.scrap)
      .then(function(data) {
        ES.insert(data);
      })
      .catch(function(err) {
        console.log(err);
      });
    },
    scrap: function(body) {
      var $ = cheerio.load(body);
      var data = [];

      $('#site-content .row').first().find('.post').each(function() {
        var $el = $(this);
        
        var $image = $el.find('img');
        var $link = $el.find('a');

        var imageUrl = $image.attr('src');
        var imageTitle = $image.attr('title');
        var title = $link.attr('title');
        var href = $link.attr('href');
        var excerpt = $el.find('.excerpt').text().trim();
        var dataDisqusIdentifier = $el.find('.info a[data-disqus-identifier]')
                                   .data('disqusIdentifier');
        
        var id = dataDisqusIdentifier
                 .substring(0, dataDisqusIdentifier.indexOf(' '));

        data.push({
          id: [name, id].join(':'),
          title: title,
          url: href,
          image: {
            url: imageUrl,
            title: imageTitle
          },
          excerpt: excerpt
        });
      });

      return data;
    }
  };
};

module.exports = Hypebeast;
