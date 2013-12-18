exports.hypebeast = {
  url: 'http://hypebeast.com/' 
};

exports.streething = {
  url: 'http://streething.com/'
}; 

exports.highsnobiety = {
  url: 'http://www.highsnobiety.com/'
}

exports.elasticsearch = {
  indexName: 'es-magazines',
  documentName: 'magazines',
  server: {
    host: 'api.searchbox.io',
    port: 80,
    secure: false,
    auth: {
      username: 'site',
      apiKey: process.env.SEARCHLY_API_KEY
    }
  }
}
