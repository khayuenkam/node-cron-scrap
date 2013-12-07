"use strict";

var cheerio = require('cheerio');
var request = require('request');
var Promise = require('bluebird');

var Hypebeast = function() {
  var page = 1;

  return {
    start: function() {
      var self = this;
      var url = 'http://www.hypebeast.com/news/';
      
      request = Promise.promisify(request);

      request(url)
      .spread(function(response, body) {
        return body;
      })
      .then(function(body) {
        return self.scrap(body);
      })
      .then(function(array) {
        console.log(array);
      })
      .catch(function(err) {
        console.log(err);
      });

    },
    scrap: function(body) {
      var $ = cheerio.load(body);
      var data = [];

      $('#site-content .row').first().find('.post').each(function() {
        var el = $(this);
        
        var $image = el.find('img');
        var $link = el.find('a');

        var imageUrl = $image.attr('src');
        var imageTitle = $image.attr('title');
        var excerpt = el.find('.excerpt').text().trim();
        var title = $link.attr('title');
        var url = $link.attr('href').replace('http://hypebeast.com', '');
        var type = el.find('.info a:nth-child(1)').attr('title');

        data.push({
          title: title,
          url: url,
          image: {
            url: imageUrl,
            title: imageTitle
          },
          excerpt: excerpt,
          type: type,
        });
      });

      return data;
    }
  };
};

module.exports = Hypebeast;
