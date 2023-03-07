const mongodb = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()

let connectionString = process.env.CONNECTIONSTRING
// for offline  
        
// always commit your changes to github after activating the online string and turning off the offline.


let port = process.env.PORT

mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){ 
  if(err){
    console.log('You have some errors: ',err)
  }
  module.exports = client

  // the require ./app file must be after client, otherwise it would generate an error.
  const app = require('./app')
    app.listen(port)
    console.log(`-------------------- Connected to db and port ${port} --------------------`)
})

