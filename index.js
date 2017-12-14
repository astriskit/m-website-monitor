let {config, is_up, sensors_source, sensors_sink, logger} = require('./config'),
websites = require('./websites')
function are_up(){
  if(websites && websites.data && websites.data.length >= 1){
    websites.data.map(website=>{
      logger(`${website.name}`, "website name")
      is_up(`${website.name}`, (err, values)=>{
        if(err){
          logger(err)
        }
        else{
          logger("values", values)
        }
      })
    })
  }
  else{
    logger("No websites yet!")
  }
}
function refresh_websites(){
  sensors_source((json)=>{
    console.log('Total sites received', json.total)
    websites = json
    config.reload_websites = false
  })
}
function index(){
  if(config.reload_websites){
    refresh_websites()
  }
  else{
    are_up()
  }
}
init_timer = config.refresh_websites_in;
let timer_id = setInterval(()=>{
  init_timer += 5000
  if(!websites || init_timer % config.refresh_websites_in == 0){
    config.reload_websites = true
  }
  index()
}, 5000)
