const fs = require("fs")

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

class CSV
{
    constructor(filename)
    {
        this.data = "";
        this.rows = ""; 
        this.filename = filename
        this.refresh();

        //console.log(this.data);
        
    }
    refresh()
    {
        fs.readFile(this.filename,(err,data) =>
        {
            
            if(err)
            {
                console.log("Error reading file:\n"+err)
                return
            }
            
            this.data = data.toString()
            this.rows = data.toString().split("\n")
            return this.toTable();

        })
    }
    startsWith(word)
    {
        let i =0;
        for(const row of this.rows)
        {
        
            if(row.startsWith(word))
            {
                console.log("Row starts with");

                return ++i;
            }
            
        }
        return -1;
    }

    /**
     * 
     * @param {string} rowToCheck 
     */
    containsRow(rowToCheck)
    {
        for(const row of this.rows)
        {
            if (rowToCheck == row)
            {
                return true
            }
        }
        return false
    }
    replaceRowIfStartsWith(word,replaceWithRow)
    {
        if(replaceWithRow == "") return;

        const index = this.startsWith(word);
        console.log("Index: "+index)
        console.log("Index: "+index);
        console.log("Word: "+word);
        if(index == -1) 
        {
            console.log("Row does not sart with word.\n")
            return ""
        }
        this.replaceRowsWith(this.rows[index],replaceWithRow);
    }
    /**
     * make a csv string row from a array
     * @param {[]} row
     * @returns string 
     */
    rowAsString(row)
    {
        let newRow = ""
        for(const item in row)
        {
            newRow += item+","
        }
        return newRow;
    }
    /**
     * Replaces the first row found with the new data and all the rest wtih an empty string
     * @param {string} word
     * @param {String} row The row you wont to remove duplicates of.
     * @param {string} replaceWithRow
     */
    replaceAllIfStartsWith(word,row,replaceWithRow)
    {
        /**
         * @type {bool}
         */
        const rowBeenUpdated = (this.replaceRowIfStartsWith(word,replaceWithRow) != "" ? true : false)
        if(rowBeenUpdated)
        {
            this.data.replaceAll(row,"");
        }
    }
    /**
     * removes all duplicate rows in the CSV file and ads the replacement row 
     * @param {string} row
     * @param {string} replacement
     */
    replaceRowsWith(row,replacement)
    {
        this.data.replaceAll(this.rowAsString(row),replacement);
        fs.writeFile(this.filename,replacement);
        this.refresh();
    }
    /**
     * 
     * @param {string} row 
     */
    addRow(row)
    {
        row.endsWith("\n") ? this.data += row : this.data += row+"\n"
    }

    /**
     * 
     * @param {string} row 
     * @param {string} startsWith
     */
    removeRowIf(startsWith, row)
    {

        let newData = ""
        for(const row of row.split("\n"))
        {
            if(row.startsWith(startsWith))
            newData+=row+="\n"
        }

    }
    /**
     * 
     * @param {JSON} obj 
     * @returns string
     */
    static turnJSONValuesIntoCSVRow(obj)
    {
        let row = "";
        for(const key in obj)
        {
            row+=obj[key]+',';
        }
        row+="\n";
        return row;
    }
    /**
     * Makes new 2d Array from the current string stored in this class
     * @returns {string}
     */
    makeNewData()
    {

    
            let newData = "";
            for(const row of this.rows)
            {
                if(row.endsWith("\n"))
                    newData+=row
                else
                    newData+=row+"\n"
            }
            return newData;
    
    }
    storeData()
    {
        let newData = this.makeNewData();
       
        fs.writeFile(this.filename,newData,(err) => {console.log(err)})
        this.refresh();

    }

    /**
     * 
     * @param {string} data 
     *
     */
    toTable()
    {
    
        console.log(this.data);
        let table = []
        for(const row of this.data.split("\n"))
        {
            const rowArr = row.split(",")
            table.push(rowArr)
        }

        return table
    }

    get table()
        {return this.toTable();}
    

}


module.exports = CSV;