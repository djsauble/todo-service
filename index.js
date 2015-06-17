var express = require('express'),
    user    = 'thistrompecoughtsideneet',
    pass    = 'VW6uPL3kNHbdlHuoovjWVCUX',
    host    = 'djsauble.cloudant.com',
    path    = '/todos',
    db      = require('nano')('https://' + user + ':' + pass + '@' + host + path),
    app     = express();

app.get("/", function(request,response) {
  db.list(function (error, body, headers) {
    if(error) { return response.status(error['status-code']).send(error.message); }
    response.status(200).send(body);
  });
});

app.listen(process.env.PORT || 3000);
console.log("server is running. check expressjs.org for more cool tricks");
