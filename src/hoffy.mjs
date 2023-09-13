// hoffy.js
import {readFile} from 'fs';

const getEvenParam = function(...args){
    const even = args.filter(index => args.indexOf(index)%2 === 0);
    return even;
}

const maybe = function(fn){
    return function(...args) {
        const may = args.filter((arg) => arg===undefined || arg===null);//filters args array to see if there are any undefined/null. 
        if (may.length !== 0) {//if the new array is greater than size 0, it has an undefined/null element in it
          return undefined;
        }
        else {
          return fn(...args);
        }
      }        
}

const filterWith = function(fn){
    return function(arg) {
        const filtered = arg.filter(arg => fn(arg) === true);
        return filtered;
    }
}

const repeatCall = function(fn, n, arg){
    if (n === 0){
        return undefined;
    }
    else{
        fn(arg);
        repeatCall(fn, n-1, arg);//recursively call with n-1
    }
}

const largerFn = function(fn, gn){
    return function(arg){
        if (fn(arg) >= gn(arg)){
            return fn;
        }
        else{
            return gn;
        }
    }  
}

const limitCallsDecorator = function(fn, n){
    let ct = 0;
    return function(...args){
        if (ct !== n){
            ct++;
            return fn(...args);
        }
        else{
            return undefined;
        }
    }
}

const myReadFile = function(file, success, failure){
    readFile(file, 'utf-8', (err, str) =>{
        if (err){
            failure(err);
        }
        else{
            success(str);
        }
    });

    return undefined;  
}

const rowsToObjects = function(data){
    const objects = data.rows.map((row) =>{//iterating over rows
        const obj = row.reduce((header, val, index) =>{//iterating over headers
            header[data.headers[index]] = val;
            return header;
        }, {})
        return obj;
    });
    return objects;
}

export {
    getEvenParam,
    maybe,
    filterWith,
    repeatCall,
    largerFn,
    limitCallsDecorator,
    myReadFile,
    rowsToObjects
};