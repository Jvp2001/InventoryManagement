const express = require('express')
const Parser = require("./parser").Parser
const Path = require("path")
const fs = require("fs")
const bodyParser = require("body-parser")
const WebSocket = require('ws');
const https = require("https")
const accounts = require("./accounts.json");
const CSV = require("./CSV.js");
const csv = new CSV("/Users/joshuapetersen/Documents/NodeApps/InventoryManagement/data.csv");
const app = express()
const WebSocketServer = WebSocket.Server,
wss = new WebSocketServer({port:3111})

let dislayTable = false;
let request = "";
let tableData = []
html = fs.readFileSync("index.html","utf-8")
const formEnd = "</body></html>"
let tableAsCSV = "";
let playerName = "Tim";

//const dom = new JSDOM(html+formEnd, { resources:"usable", runScripts:"outside-only"})

// const window = dom.window
let loggedInUser = "";

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(Path.join(__dirname,".")))

wss.on("connection",ws =>
{
	Parser.table = csv.toTable()

	ws.send("Connected!")

	ws.on("message", message =>
	{
		if(message.startsWith("TableData:"))
		{
			console.log(message)
			let msg = message.replace("TableData:","");
			console.log(msg)
			if(msg == "") 
			{
				console.log("MSG IS EMPTY!"); 
				csv.storeData();
				return;
			}
			console.log("msg:\n")
			let obj = JSON.parse(msg);
			//console.log(obj)
			if(isEmpty(obj)) 
			{
				console.log("OBJECT IS EMPTY!")
				return;
			} 
			console.log(`StartsWith: ${csv.data.includes(obj["R Name"])}`);
			csv.replaceRowIfStartsWith(obj["R Name"],CSV.turnJSONValuesIntoCSVRow(obj));
			
			csv.storeData();
			
			//console.log(d);
			//console.log(Parser.table);
			
		}
		if(playerName != "")
		{
			ws.send("Player Name: "+playerName);
		}
		if(request == "##RETRIEVE_TABLE_DATA##")
		{
			ws.send("##RETRIEVE_TABLE_DATA##")
		}
	})
})

function isEmpty(obj) 
{
	for(var key in obj) 
	{
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// viewed at http://localhost:8080
function handler (req, res)
 {
	//	

	res.send(indexPage)
	// res.writeHead(200);
	//console.log(Parser.table)
	//res.send(form+formEnd);
	res.end(formEnd);
}
app.get('/',handler)


// app.get("/submit-form",handler);
app.post('/submit-form', (req, res) =>
{
	app.use(express.static(Path.join(__dirname,".")))
	      res.setHeader("Content-Type", "text/html")
	//console.log(csv.toTable());
	console.log(req.body)
	const username = req.body.Player
	//...
	let  userRow = []

	
	let outData = "";
	for (const row of csv.table) 
	{
		if(username == row[0])
		{
			userRow = row
			break;
		}
	}
	
	
	//console.log("User Row: "+userRow)
	if(userRow)
		for(const datum of userRow)
		{
			outData += datum
			outData+= ", "
		}

	outData+="<br>"
	//console.log("Out Data: "+outData)
	//console.log(outData);
	res.sendFile("/index.html")

	//console.log("Headers: "+getHeaders())
	res.send(html+"<br>"+makeTable(getHeaders(),outData)+formEnd)
	if(dislayTable)
	{
		request = "##RETRIEVE_TABLE_DATA##"
		console.log("Retriveing data!")
	}
	dislayTable = true

})



function getHeaders()
{
	return Parser.table[0]
}


function makeTable(headers,data)
{
	let table = "<table id=\"data\" class=\"defualt-style\">"
	let headerRow = (headers) =>
	{
		let row = "<thead><tr>"
		for(const header of headers)
		{	
			row+="<th>"+header+"</th>"

		}
		return row+"</thead></tr>"
	}
	let hr = headerRow(headers)
	let dataRow = (data) =>
	{
		let row = "<tr"+"id=\"user-"+data[0]+">"
		for(const datum of data.split(", "))
		{
			let index = data.split(", ").indexOf(datum)
			if(datum.includes("</p>"))
				row += "<td onclick=\"testFunc(event)\"><p>"+datum+"</td>"
			else
				row +="<td id="+index+">"+datum+"</td>"

		}
		//console.log("Row: "+row)
		return row+"</tr>"
	}
	let dr = dataRow(data);
	table += hr+dr+"</table>"
	return table
}



JSON.toCSV = arr =>
{
	let csvData = "" 
	let bAppendedHeaders = false;
	for ( const obj of arr)
	{

		let row = ""

		if(!bAppendedHeaders)
		{
			for(const header in headers)
			{
				row += header+",";
			}
			bAppendedHeaders = true;
		}
		else
			for (const key in obj)
			{
				csvData+=obj[key]+",";
			}
		row+="\n"
		csvData+=row

	} 
}

app.listen(1322);