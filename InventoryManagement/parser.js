//const test = require("./test.js")
const fs = require("fs")

const querystring = require("querystring");
String.prototype.replaceAll = function(searchStr, replaceStr)
{
	var str = this;

    // no match exists in string?
    if(str.indexOf(searchStr) === -1) 
    {
        // return string
        return str;
    }

    // replace and remove first match, and do another recursirve search/replace
    return (str.replace(searchStr, replaceStr)).replaceAll(searchStr, replaceStr);
}

Parser = {data:{}}  

let data = {headers:[],names:[],players:[]}
let fileData = ""
let players = []
let headerIndexes = {}
table = []


fs.readFile("./data.csv",(error,data) =>
{
  //console.log("Reading File...")
  let contents = data.toString()
 // console.log(contents)
  //contents  = contents.replaceAll("; ","</p>")
  //console.log("Has ; "+contents.includes("; "))
  contents.replaceAll("; ","</p>")
  contents.replaceAll(";","");

  for(let row of contents.split("\n"))
  {
    row = row.replaceAll(", ",",")
    //row.replace("</p>","; ")
    
    
    const rowData  = row.split(",")
    //console.log(rowData)
    table.push(rowData)
      
    //table.push(row.split(","))
  }
  //console.log(contents)
  //console.log(table)
})

//console.log(getData().names)



Parser.data = data;
Parser.players = players; 
Parser.table = table;

let r = ""
let getPersonData = (person) =>
    {
      for (const row of table) 
      {
        if(person == row[0])
        {
            r = row 
            break;
        }
      }
      return r
    }
  

Parser.getPersonData = getPersonData;
module.exports.Parser = Parser;
//console.log(exports.players.length)

console.log("Parser imported!")
