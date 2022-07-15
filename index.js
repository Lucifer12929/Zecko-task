const { GoogleSpreadsheet } = require('google-spreadsheet');

// File handling package
const fs = require('fs');
const fetch=require('cross-fetch')
var XMLHttpRequest = require('xhr2');

let col=6;
// spreadsheet key is the long id in the sheets URL
const RESPONSES_SHEET_ID = '1NMAvrY5t2IXJhr9AehkcRcseIi8aZKcuL0-lGmYKCgo';

// Create a new document
const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID);
var count=7;
// Credentials for the service account
const CREDENTIALS = JSON.parse(fs.readFileSync('credentials.json'));


const getRow = async (val) => {

    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    // load the documents info
    await doc.loadInfo();

    // Index of the sheet
    let sheet = doc.sheetsByIndex[0];

    // Get all the rows
    let rows = await sheet.getRows();
    

    for(let i=1;i<2;i++){
    var update=rows[val].Website;
       
    var url = `https://api.wappalyzer.com/v2/lookup/?urls=${update}`;
    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    var x=0;
    xhr.setRequestHeader("x-api-key", "oLHjUbAR6g6qkJ9Yqf9Z48NYDCGSwh7r94S2dXOr");

    xhr.onreadystatechange = function () {
     if (xhr.readyState === 4) {
      console.log(xhr.status);
     const jsonData =JSON.parse(xhr.responseText);
     const data1=jsonData[0].technologies;
     var b=false;
     if(!data1)
     {
        addRow('NOT_WORKING');
       
        console.log('i');

        
     }
     
     
     else{
     const l=data1.length;
     for(let i=0;i<l;i++)
     {
        if(data1[i].slug=="shopify"){
            
            addRow('SHOPIFY');
            b=true;
            
        }
        else if(data1[i].slug=="woocommerce"){
            
            addRow('WOOCOMMERCE');
            b=true;
            
        }
        else if(data1[i].slug=="bigcommerce"){
           
            addRow('BIGCOMMERCE');
            
            b=true;
           
        }
        else if(data1[i].slug=="magento"){
            
            addRow('MAGENTO');
            
            b=true;
           
        }
       
     }
     if(b===false) {
    addRow('OTHERS');
     }
     
    }};
    x=x+1;}
    
    xhr.send();

        
    };
};

for(let i=1;i<8;i++){
    count=count-1;
    getRow(count);
}

const addRow = async (val) => {

    // use service account creds
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo();

    // Index of the sheet
    let sheet = doc.sheetsByIndex[0];
  
    let rows = await sheet.getRows()
    
        rows[col]['Categories']=val;
    
        await rows[col].save();
        col=col-1;
        
   
};



// addRow('hello');

