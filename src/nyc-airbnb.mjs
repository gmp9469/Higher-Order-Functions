// nyc-airbnb.mjs
import {readFile} from 'fs';
import * as hoffy from '../src/hoffy.mjs';

readFile('data/AB_NYC_2019.csv', 'utf8', (err, data) =>{
    if (err){
        console.log('exit');
        process.exit();
    } 
    else {
        const rows = data.split('\n');
        const headers = rows[0].split(',');
        const regex = /,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/g; //https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
        const parsedRows = rows.slice(1).map(row => row.match(regex).map(val => val.replace(/^"|"$/g, '')));
        const parsedData = { headers, rows: parsedRows };
        const dataArray = hoffy.rowsToObjects(parsedData);
    }
})

const getAveragePrice = function(data){
    const homes = data.filter(val => val.room_type === "Entire home/apt");
    const rooms = data.filter(val => val.room_type === "Private room");
    const avgh = homes.reduce((sum, x) => Number(sum) + Number(x.price), 0) / homes.length;
    const avgr = rooms.reduce((sum, x) => Number(sum) + Number(x.price), 0) / rooms.length;
    return [avgh, avgr].map(x => +x.toFixed(2));//rounds to 2 decimal places and converts it back to a num
}
  
const mostReviews = function(data){
    return data.reduce((highest, current) =>{
        return Number(current.number_of_reviews) > Number(highest.number_of_reviews) ? current : highest;
    });
}

const getUniqueHosts = function(data){
    //https://stackoverflow.com/questions/6712034/sort-array-by-firstname-alphabetically-in-javascript 
    const sorted = data.sort((a, b) => a.host_name.localeCompare(b.host_name));
    const unique = sorted.reduce((acc, obj) =>{
        if(!acc.includes(obj.host_name)){
            acc.push(obj.host_name); //to make sure no duplicates
        }
        return acc;
    }, []);
    return unique.slice(0, 5);
}

const getHousingBorough = function(data){
    const boroughs = ["Manhattan", "Brooklyn", "Queens", "Staten Island", "Bronx"];
    return data.reduce((result, curr) =>{
        if (boroughs.includes(curr.neighbourhood_group)){
            if (result[curr.neighbourhood_group] === undefined){
                result[curr.neighbourhood_group] = 1;
            } 
            else{
                result[curr.neighbourhood_group] += 1;
            }
            return result;
    }   
    }, {});
}
  
export{
    getAveragePrice,
    mostReviews,
    getUniqueHosts,
    getHousingBorough
}

