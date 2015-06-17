var express = require('express')
   , db    = require('nano')('https://thistrompecoughtsideneet:VW6uPL3kNHbdlHuoovjWVCUX@djsauble.cloudant.com/todos')
   , app     = module.exports = express();

app.get("/", function(request,response) {
  db.get("foo", function (error, body, headers) {
    if(error) { return response.send(error.message, error['status-code']); }
    response.send(body, 200);
  });
});

app.listen(3333);
console.log("server is running. check expressjs.org for more cool tricks");
