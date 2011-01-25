var connect = require('connect');

var server = connect.createServer(
   connect.logger(),
   connect.conditionalGet(),
   connect.cache(),
   connect.gzip(),
   connect.staticProvider(__dirname)
);

server.listen(8888);
console.log("Robot is operational, Sir!");
