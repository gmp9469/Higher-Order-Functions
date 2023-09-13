// report.js
import * as hoffy from '../src/hoffy.mjs';
import * as drawing from '../src/drawing.mjs';
import * as nyc from '../src/nyc-airbnb.mjs';
import {readFile} from 'fs';
import process from 'process';

readFile('data/AB_NYC_2019.csv', 'utf8', (err, data) =>{
    if (err){
        console.log(err);
        process.exit();     
    } 
    else{
        reports(data);
    }
})

function reports(data){
    const rows = data.split('\n');
    const headers = rows[0].split(',');
    const regex = /,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/g; //https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
    const parsedRows = rows.slice(1).map(row => row.split(regex));
    const parsedData = { headers, rows: parsedRows };
    const dataArray = hoffy.rowsToObjects(parsedData);

    const avg = nyc.getAveragePrice(dataArray);
    console.log("The average price for entire home/apt is " + avg[0] + " and for private room is " +avg[1]);

    const reviewed = nyc.mostReviews(dataArray);
    console.log("The house with most reviews is named \"" + reviewed.name + "\" hosted by " + reviewed.host_name + ". It has " + reviewed.number_of_reviews + " reviews");
    
    const unique = nyc.getUniqueHosts(dataArray);
    console.log("The first five unique hosts after sorting is:");
    const dummy = unique.map(function(ele){
        console.log("'" + ele + "',");
        return ele;
    })

    const housing = nyc.getHousingBorough(dataArray);
    const boroughs = ["Manhattan", "Brooklyn", "Queens", "Staten Island", "Bronx"];
    const root = new drawing.RootElement();
    root.addAttrs({width: 200 * boroughs.length, height: 500});
    const elements = boroughs.map((borough, i) =>{
        const count = housing[borough];
        const rect = new drawing.RectangleElement(200*i, 0, 100, count/100, 'blue');
        const text = new drawing.TextElement(200*i, 250, 20, 'black', borough  +": " + count);
        root.addChild(rect);
        root.addChild(text);
        return [rect, text];
    });
    root.write('nyc-airbnb-boroughs.svg', () =>{
        console.log();
    })
}