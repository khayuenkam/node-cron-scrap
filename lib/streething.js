"use strict";

var cheerio = require('cheerio'),
    Promise = require('bluebird'),
    request = Promise.promisify(require('request')),
    configSt = require('../config').streething,
    esClient = require('./elasticsearch');

var Streething = function() {
  var url = configSt.url,
      name = configSt.name,
      ES = esClient();

  return {
    start: function() {
      var targetUrl = [url, 'page/1'].join('');
      
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

      $('#newslist .news').each(function() {
        var $el = $(this);

        var $newsImage = $el.find('.newsimage');
        var $newsDesc = $el.find('.newsdesc');

        var imageUrl = $newsImage.find('img').attr('src');
        var href = $newsImage.find('a').attr('href');
        var title = $newsDesc.find('.newstitle').text();
        var excerpt = $newsDesc.find('.newsshortdesc').text().trim();

        var newUrl = href.replace([url, 'news/'].join(''), '')
        var id = newUrl.substring(0, newUrl.indexOf('/'));

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

module.exports = Streething;
