const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')
const axios = require('axios')
const moment = require('moment')


const app = express()
const port = process.env.PORT || 4000
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer m773xgH1gU3m8t+PSceOavPKpB2tVU2x9qG0BCMaqsHQPGUTvqySuCylpCt2V4pEtBI45IfcgD2j8ft2/8N5Rzl7frDbcafwBLPEVK+aJOUEFYK6kj+z7IaHYOfGD6Bs/pAdc/C1ejy5zHqqej/L2AdB04t89/1O/w1cDnyilFU='
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Push
app.get('/webhook', (req, res) => {
	// push block
	let msg = 'Hello World!'
	push(msg)
	res.send(msg)
})

// Reply
app.post('/webhook', async (req, res) => {
	// reply block
	let reply_token = req.body.events[0].replyToken
	let json_becon = req.body.events[0];
	console.log(json_becon)
	if (json_becon.type === 'beacon') {
		let newObj = {
			"beacon": {
				"datetime": moment().format('YYYY-MM-DD hh:mm:ss'),
				"status": req.body.events[0].beacon.type,
			}
		}
		let res = await axios.post('http://202.139.192.106:8080/line/putSanam', newObj)
		
		reply(reply_token, JSON.stringify(res))
		
	} else if (json_becon.message.text === 'Admin_Mon') {
		let responses = await axios.get('http://202.139.192.106:8080/line/adminMon')
		let dataSendToLine = ` จำนวนคนเข้าชม : ${responses.data.beacons.p_in} ${"\n"} จำนวนคนออก : ${responses.data.beacons.p_out} ${"\n"} อุณหภูมิ : ${responses.data.sensors.Temperature} ${"\n"} ความชื้น : ${responses.data.sensors.Humidity}`
		reply(reply_token, dataSendToLine)
	} else {
		reply(reply_token,"แอบมองเธออยู่นะจ๊ะ")
	}
})

function push(msg) {
	let body = JSON.stringify({
		// push body
		to: 'U52ddc37ec3c5fb7cf23e2c106ad3bb2a',
		messages: [
			{
				type: 'text',
				text: msg
			}
		]
	})
	curl('push', body)
}

function reply(reply_token, msg) {
	let body = JSON.stringify({
		// reply body
		replyToken: reply_token,
		messages: [
			{
				type: 'text',
				text: msg
			}
		]
	})
	curl('reply', body);
}

function curl(method, body) {
	request.post({
		url: 'https://api.line.me/v2/bot/message/' + method,
		headers: HEADERS,
		body: body
	}, (err, res, body) => {
		console.log('status = ' + res.statusCode)
	})
}

app.listen(port, () => {
	console.log(`Server running`)
})