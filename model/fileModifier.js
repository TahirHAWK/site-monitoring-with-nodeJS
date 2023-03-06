const fs = require('fs')
const siteData = require('../db').db().collection('siteData')

let FileModifier = function(data){
    this.data = data
    this.errors = []
} 


FileModifier.prototype.fileAppender = function(text, fileName){
    return new Promise((resolve, reject)=>{
          fs.appendFile(fileName, text, function (err) {
            if (err) {
              // append failed
              console.log('// append failed')
              console.log(err, 'from appender function')
              reject()
            } else {
              // done
              console.log('// append done') 
              console.log('site loaded, check specific file.')
              resolve()
            }
          })
    })

}

FileModifier.prototype.insertNewWebPageAndCompare = function(pageLink, scrapedWebPage){
  return new Promise((resolve, reject)=>{
    console.log("// 1. check new web page if it was previously stored or not")
    siteData.findOne({pageLink: pageLink}).then((result)=>{
  
        console.log(" // 2. If it is stored, then compare it with the previous one.")
        if(result.WebPage == scrapedWebPage){
          console.log("// it means no change has occured")
          resolve()
        } else{
          console.log("// here it means a change has detected, and now it should be replaced with the old one and update the time of change detection, make the property of telegram status to 'sendReady'. change the telegram notification status to 'sent' after the cronjob has done(cronjob function has to be made in such a way that it modifies the telegram status of that specific data)")
          siteData.updateOne({pageLink: pageLink}, {WebPage: scrapedWebPage, telegramStatus: 'sendReady'}).then((confirmation)=>{
            console.log(confirmation, '// New change on the site has been updated for telegram.')
            resolve()
          })
          
        }
      
    }).catch((diffResult)=> {
      console.log("// 3. if not, then store it for the first time for future comparison")
      siteData.insertOne({pageLink: pageLink, WebPage: scrapedWebPage, telegramStatus: 'new' }).then((res)=>{
        resolve("added new page to db")
      }).catch((err)=>{
        this.errors.push("Couldn't store the new data.")
        reject("couldn't add the new data to db")
      })
    }) // end of first .then block


  }) // end of promise
}

module.exports = FileModifier