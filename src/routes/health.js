const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {

  if(req.query["x-api-key"] !== "mysecret") {
    res.send("{\"result\":\"FAIL\"}");
    return;
  }

  var health = {}
  health.statusOk = true
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(health));
});

module.exports = router;
