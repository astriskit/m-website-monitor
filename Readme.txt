Introduction
------------
This is a simple tool to query websites/URLs, for their live status. Based on the response received from the server,
the status is updated.

It is handy to retrieve the urls over a REST API and submit the response over a REST API in the system.

Development Stage : It is very primitive now. I hope to improvise in time.
-----------------

How to run
----------
> Environment setup
  - Install Node and npm.
  - Install request (`npm install request` or `yarn add request`)
> Download the source code from this repository.
> Go inside the folder where you have copied the repository.
> Change the company_id and ss_token using below mentioned information.
> Run - `node index.js`

Working
-------
The above steps should start the script, which will work in following manner -

> Start -> Check if `reload_websites` from `config` is `true` -> If yes, load websites from the source host. If, no,
check the websites'(already loaded) status and push it to the sink host. -> Go to sleep for `refresh_status_in` milliseconds
-> Wake and repeat from Start.

Configurations
--------------
> `config.js` is the main configuration file in here. It can be updated in accordance of the needs.
> In `config.js`, `config` variable contains various settings which can be changed -
  - `debug` : A boolean controlling the debug-logging functions.
  - `reload_websites` : A boolean value determines if the sensors(websites) are to be refreshed.
  - `refresh_websites_in` : Tells the monitor to refresh the websites list in mentioned milliseconds.
  - `refresh_status_in` : Tells the monitor to refresh the status of websites in mentioned milliseconds.
  - `ss_token` : Relevant to REST API, it is an authorization token to retrieve websites list and save the status.
  - `source_host` : Host name from where the sources are fetched.
  - `source_port` : Port number of the source-host.
  - `sink_host` : Host name to where the status of the websites are saved.
  - `sink_port` : Port number of the sink host.
  - `company_id` : Company-id of the sensor. It is a Swarm-sense specific detail.
  - `source_path` : It is a function which provides with the url( using the company-id ) from where sensors will be fetched. It is specific to Swarmsense now.
  - `sink_path` : It is a function which provides with the url( using sensor-id) where the status are saved. It is specific to Swarmsense now.
  - `sink_method` : Defines HTTP verb to save the websites' status.
  - `source_method` : Defines HTTP verb to get the websites' list.
