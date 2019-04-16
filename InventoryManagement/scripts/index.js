var ws = new WebSocket("ws://localhost:3111")
let table = {}
let cells = []
var headers = [];
let playerName = "";
ws.onmessage = message =>
{
	// if(message.toString().startsWith("Player Name: "))
	// {
	// 	let msg = message.toString().replace("Player Name: ","");
	// 	if(msg != "")
	// 		playerName = msg;
	// }
	if(message == "##RETRIEVE_TABLE_DATA##")
	{
		retrieveTableData();
		storeTableData();
		console.log("RETRIEVE_TABLE_DATA")
	}



	
	console.log(message.toString())
}
window.onload = () =>
{
	
	retrieveTableData();
	   //storeTableData();
	let i = 0 
	for(const cell of cells)
	{

		cell.ondblclick = (event) =>
		{
			
			
			let index = cell.id;
			let title = headers[index];
			console.log("value:"+cell.innerHTML);
			showEditBox(title,cell);
			console.log("DBClicked!")
			i++;

		}

	}
};
 
                        
function retrieveTableData()
{
	table = document.getElementById("data");
	headers = makeArrayFromNodeArray(document.getElementById("data").getElementsByTagName("th"));
	cells = table.querySelectorAll("td");
	console.log("Headers:\n")
	console.log(headers)
	storeTableData()
	/**
	 * @type {HTMLSelectElement}
	 */
	PlayersDropdown = document.getElementById("Players")
	
}
function storeTableData()
{
	table.TableData = {};
	for(let header of headers)
	{
		//console.log(table[header]);
		table.TableData[header] = cells[headers.indexOf(header)].innerHTM;
	}
}
function makeArrayFromNodeArray(arr)
{
	let newArr = []
	for(const item of arr)
	{
		newArr.push(item.innerHTML);
	}
	return newArr;
}
/**
 * 
 * @param {stinrg} title 
 * @param {HTMLTableCellElement} cell 
 */
function showEditBox(title,cell) 

{

	window.cell = cell
	console.log(cell);	
	
	console.log("Cell Value: "+cell.innerHTML)
	bootbox.prompt
	({
		title: title,
		inputType: 'textarea',
		value: table.TableData[title],
		
		callback: function (result) 
		{
			console.log("Callback called!");
			if(result)
			{
				console.log("Result:"+result)
				cell.innerHTML = result;
				console.log("CellText: "+cell.innerHTML)
				storeTableData();
				alert(cell.innerHTML)
				 console.log(JSON.stringify(table.TableData));
				
					
			}
			storeTableData();
		}
	});
}


function isEmpty(obj) 
{
	for(var key in obj) 
	{
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function submitFunc()
{
	storeTableData();
	console.log("TableData: "+table.TableData == {})
	console.log(isEmpty(table.TableData));
	if(!isEmpty(table.TableData)) ws.send("TableData:"+JSON.stringify(table.TableData));
	console.log("sending data:\n")
	console.log(table.TableData)
}

function serverReady()
{
	

}




function logIn()
{
	bootbox.prompt(
	{
		title: "This is a prompt with a password input!",
		inputTypes:
		[
			'text',
			'password',
		],
		size: "large",
		
		callback: function (result) {
			console.log("Password: "+result)
			if(result == "Portal")
			{
			 
			   
	
			}
			else
			{
				this.callback(result);
			}
		},
	})
}