const axios = require('axios')
const FileModifier = require('../model/fileModifier')

// headers are used so that the code doesn't show any errors, I don't know what it does but it won't work without it
exports.addNewSite = function(req, res){
    // extracting site page data
    let pageLink = 'https://hstu.ac.bd/page/all_notice/type/f/id/2'
    axios.get( pageLink , { 
        headers: { "Accept-Encoding": "gzip,deflate,compress" } 
    })
    // appending the html to a new file
    .then((result)=> {
       let scrapedWebPage = result.data
       let fileMod = new FileModifier(scrapedWebPage)
       fileMod.fileAppender(scrapedWebPage, 'hstu_notice.html')
    // take scraped webpage and compare it with the old one
       .then((onSuccess)=>{
        // 1. put the scraped webpage on mongodb
        fileMod.insertNewWebPageAndCompare(pageLink, scrapedWebPage)
       }).then((something)=>{
        res.send('the whole function ran successfully.')
       }) 
     
   })
   .catch((err)=>{
    console.log(err, '<<-- cannot load the site')
   })
}