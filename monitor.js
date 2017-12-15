let {config, is_up, sensors_source, sensors_sink, logger} = require('./config'),
websites = require('./websites'),
express = require('express')

/**
* Loads the websites and gets the status of the websites.
* @arg {are_up_callback} [callback] Callback that handles the response from querying the status.
**/
function are_up(callback=null){
  if(websites && websites.data && websites.data.length >= 1){
    websites.data.map(website=>{
      // logger(`${website.name}`, "website name")
      is_up(`${website.name}`, (err, values)=>{
        if(callback){
          callback(err, values)
        }
        else{
          config.debug = true
        }
        if(config.debug){
          if(err){
            logger(err)
          }
          else{
            logger(`${values.url}(est. response-time: ${values.time} ms): ${values.code}`)
            // logger(values.code)
          }
        }
      })
    })
  }
  else{
    logger("No websites yet!")
  }
}
/**
* @callback are_up_callback The callback to handle responses after a website is queried.
* @arg {Object} err The object indicating the error
* @arg {Object} values The object containing the response from the website queries.
* @arg {Number} values.code Response code of the website. For ex., 200, 503, etc.
* @arg {String} values.body Raw response body received from the website.
* @arg {Number} values.time Estimated response time in milliseconds while completing query.
* @arg {String} values.url Url of the website queried.
**/
/**
* It refreshes the websites list.
**/
function refresh_websites(){
  sensors_source((json)=>{
    // console.log('Total sites received', json.total)
    websites = json
    config.reload_websites = false
  })
}
/**
* It toggles between refreshing the websites list and querying each of them. Depends upon
**/
function index(){
  if(config.reload_websites){
    refresh_websites()
  }
  else{
    are_up()
  }
}
init_timer = config.refresh_websites_in;
exports.module.monitor = ()=>{
  let timer_id = setInterval(()=>{
    init_timer += 5000
    if(!websites || init_timer % config.refresh_websites_in == 0){
      config.reload_websites = true
    }
    index()
  }, 5000)
  return timer_id
}
