var express = require('express')
   , db    = require('nano')('https://thistrompecoughtsideneet:VW6uPL3kNHbdlHuoovjWVCUX@djsauble.cloudant.com/todos')
   , app     = module.exports = express();

app.get("/", function(request,response) {
  db.list(function (error, body, headers) {
    if(error) { return response.status(error['status-code']).send(error.message); }
    response.status(200).send(body);
  });
});

app.listen(3333);
console.log("server is running. check expressjs.org for more cool tricks");
