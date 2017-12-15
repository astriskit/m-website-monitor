let http = require('http'),
https = require('https'),
request = require('request'),
config = {
	debug:true,
	reload_websites:true,
	refresh_websites_in: 15*60*1000, // ms
	refresh_status_in: 30*1000,
	ss_token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImV4cCI6MTUxNTA0NjAyMywiaWF0IjoxNTEyNDU0MDIzfQ.9FKf7VcWusZ-_MH5PkmaqyEZKlqbrOej6mhYLRQTib4',
	source_host:'45.79.8.213',
	source_port:5000,
	sink_host:'http://45.79.8.213',
	sink_port:5000,
	company_id:'cb8528a117f8',
	source_path:(company_id)=>`/companies/${company_id}/sensors`,
	sink_path:(sensor_id)=>`/sensors/${sensor_id}/values`,
	sink_method: 'POST',
	source_method: 'GET',
},
sensors_sink = (sensor_id, values)=>{
	let options = {
		url:config.sink_host + ':' + config.sink_port + config.sink_path(sensor_id),
		// port:config.sink_port,
		// path:config.sink_path(sensor_id),
		method:config.sink_method,
		formData:{
			response_code:values.code,
			reply_time:values.time,
			response:{
				value: Buffer.from(values.body),
				options:{
					filename: 'response.html',
					contentType: 'text/html'
				}
			}
		},
		headers:{
			'Authorization': `token ${config.ss_token}`,
			'Content-Type':'multipart/form-data'
		}
	}
	request(options, (err, response, body)=>{
		if(err){
			logger(`Error occurred while posting. ${err}`)
		}
		else{
			logger(`Success posting. Status-code: ${response.statusCode}`)
		}
	});
},
logger = (mesg)=>{
	console.log(`Logger:> ${mesg}`)
},
sensors_source = (callback=null)=>{
	let options = {
		host:config.source_host,
		port:config.source_port,
		path:config.source_path(config.company_id),
		method:config.source_method,
		headers:{
			'Authorization': `token ${config.ss_token}`,
			'Content-Type': 'application/json'
		}
	},
	req = http.request(options, (res)=>{
		let body = ''
		res.on('data', (chunk)=>{
			body += chunk
		})
		res.on('end', ()=>{
			if(body){
				try{
					let json_response = JSON.parse(body)
					logger("Total sensors received: " + json_response.total)
					// console.log(json_response.data, json_response.total)
					if(callback){
						callback(json_response)
					}
				}
				catch(e){
					if(e.name === 'SyntaxError'){
						logger("Parsing error in json received. " + e.message )
					}
					else{
						throw e;
					}
				}
			}
			else{
				logger('No response from the server!')
				if(callback){
					callback(null)
				}
			}
		})
	});
	req.on('error', (e)=>{
		logger('Could not fetch the websites: '+ e.message) // log it.
	});
	req.end();
},
is_up = (url, callback) => { //callback receives two argument - err, values.
	if(!url.startsWith('http://') && !url.startsWith('https://')){
		url = `http://${url}`
	}
	let module = http
	if(url.startsWith('https://')){
		module = https
	}
	let req = module.get(url, (res)=>{
		// logger(url)
		let body = '', time_it = 0 //in ms,
		time_id = setInterval(()=>time_it+=1, 1), code=res.statusCode
		res.on('data', (chunk)=>{
			body += chunk
		})
		res.on('end', ()=>{
			// logger(body)
			time_id.close();
			let values = {
				url,
				time:time_it,//ms
				body,
				code
			}
			callback(null, values)
		})
	})
	req.on('error', (err)=>callback(err))
	req.end()
}
module.exports= {
	config,
	logger,
	sensors_sink,
	sensors_source,
	is_up,
}
