// drawing.js
import {writeFile} from 'fs';

class RootElement {
    constructor() {
        this.xmlns = "http://www.w3.org/2000/svg";
        this.attributes = {};
        this.children = []; 
    }

    addAttr(name, value){
        this.attributes[name] = value;
    }

    setAttr(name, value){
        this.attributes[name] = value;
    }

    addAttrs(obj){
        Object.assign(this.attributes, obj);
    }

    removeAttrs(arr){
        this.attributes = Object.keys(this.attributes).reduce((obj, key) => {
            if (!arr.includes(key)){
                obj[key] = this.attributes[key];
            }
            return obj;
        }, {});
    }

    addChild(child){
        this.children.push(child);
    }

    toString(){
        let attrsString = "<svg xmlns='" + this.xmlns + "' ";
        Object.entries(this.attributes).forEach(([name, value]) =>{
            attrsString += `${name}='${value}' `;
        });
        attrsString += ">\n";
        this.children.forEach(child =>{
            if (child instanceof GenericElement){
                attrsString += "<" + child.name + " ";
                Object.entries(child.attributes).forEach(([prop, value]) =>{
                    attrsString += `${prop}='${value}' `;
                });
                attrsString += ">\n</" + child.name + ">\n";
            } else if (child instanceof RectangleElement){
                attrsString += `<rect x='${child.x}' y='${child.y}' width='${child.width}' height='${child.height}' fill='${child.fill}'>\n</rect>\n`;
            } else if (child instanceof TextElement) {
                attrsString += `<text x='${child.x}' y='${child.y}' fill='${child.fill}' font-size='${child.fontSize}'>${child.content}\n</text>\n`;
            }
        });
        attrsString += "</svg>";
        return attrsString;
    }
    

    write(fileName, cb){
        const data = this.toString();
        writeFile(fileName, data, (err) =>{
            if (err){
                console.log(err);
            }
            else {
                cb();
            }
        })
    }
}

class GenericElement extends RootElement{
    constructor(name){
        super();
        this.name = name;
    }
}
class RectangleElement extends RootElement{
    constructor(x, y, width, height, fill){
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fill = fill;
    }
}

class TextElement extends RootElement{
    constructor(x, y, fontSize, fill, content){
        super();
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.fill = fill;
        this.content = content;
    }
}

export{
    RectangleElement,
    RootElement,
    GenericElement,
    TextElement
}
/*
// the following is used for testing
// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({width: 800, height: 170, abc: 200, def: 400});
root.removeAttrs(['abc','def', 'non-existent-attribute']);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({'cx': 200, 'cy': 80});
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);

// show string version, starting at root element
console.log(root.toString());

// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));*/