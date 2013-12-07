var cronJob = require('cron').CronJob;
var Hypebeast = require('./lib/hypebeast');

    Hypebeast().start();
var job = new cronJob({
  cronTime: '1 * * * * *',
  onTick: function() {
    console.log('hello');
   // Hypebeast().start();

  }, 
  start: true
});
