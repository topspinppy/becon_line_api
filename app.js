const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 4000
const hostname = 'line-bot-tesa-nernhom400.herokuapp.com'
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer HUWzoOZ9yNeWTjO3I9yWCC7NeY0nKnjV9kh8fVhCqhwpKQ//1vYUIbTAnuY2pSHrtBI45IfcgD2j8ft2/8N5Rzl7frDbcafwBLPEVK+aJOVY6bBUS+MlRlggZA4RD3eS4n/5WnEc+0qNQYdgCSLesgdB04t89/1O/w1cDnyilFU='
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
	if (req.body.events[0].type === 'beacon') {
		reply(reply_token, JSON.stringify(json_becon))
		let response = await axios.post('http://202.139.192.106:8080/line/putSanam', `data => ${req.body.events[0]}`)
	} else {
		reply(reply_token, "d")
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

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})