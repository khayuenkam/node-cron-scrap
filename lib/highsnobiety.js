"use strict";

var cheerio = require('cheerio'),
    Promise = require('bluebird'),
    request = Promise.promisify(require('request')),
    configHn = require('../config').highsnobiety,
    gunzip = Promise.promisify(require('zlib').gunzip),
    esClient = require('./elasticsearch');

var Highsnobiety = function() {
  var url = configHn.url,
      name = configHn.name,
      ES = esClient();

  return {
    start: function() {
      var targetUrl = [url, 'page'].join('');
      
      request({ url: url, encoding: null })
      .spread(function(response, body) {
        return response;
      })
      .then(function(response) {
        console.log(response.headers['content-encoding']);
        return gunzip(response.body);
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
      body = body.toString();

      $('.stream article').each(function() {
        var $el = $(this);

        var $headerLink = $el.find('header h2 a');
        var $teaserImg = $el.find('.teaser-img');

        var imageUrl = name + $teaserImg.find('img').attr('src');
        var href = $headerLink.attr('href');
        var title = $headerLink.attr('title');
        var excerpt = $el.find('.ellipsis').text().trim();
        excerpt = excerpt.substring(0, excerpt.lastIndexOf('…') + 1);

        var id = $el.attr('id').replace('post-', '');

        data.push({
          id: [name, id].join(':'),
          title: title,
          url: href,
          imageUrl: imageUrl,
          excerpt: excerpt,
          type: name
        });
      });

      return data;
    }
  }
}

module.exports = Highsnobiety;
