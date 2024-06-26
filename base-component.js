class BaseComponent {
constructor(elements = [], states = {}) {
this.internalElements = elements;
this.states = this.createStates(states);
this.baseElement = this.createElements(elements);
this.node = this.baseElement.main.node;
this.renderedOn = null;
}
createElement(element) {
if (element.type) {
const newElement = document.createElement(element.type);
if (element.attr) {
Object.keys(element.attr).forEach((attr) => {
newElement.setAttribute(attr, element.attr[attr]);
});
}
if (element.evt) {
element.evt.forEach((evt) => {
newElement.addEventListener(evt.name, evt.callback);
});
}
if (element.content) {
newElement.innerHTML = this.bindState(element.content);
}
return newElement;
}
}
createElements(elements) {
const structures = {};
elements.forEach((element) => {
const currentElement = this.createElement(element);
structures[element.name] = { ...element, node: currentElement };
if (element.child) {
const childElement = this.createElements(element.child);
structures[element.name].child = childElement;
Object.values(childElement).forEach(child => {
currentElement.appendChild(child.node);
});
}
});
return structures;
}
createStates(states) {
return { ...states };
}
bindState(content) {
return content.replace(/\{\[([^\]]+)\]\}/g, (match, stateName) => {
return this.states[stateName] !== undefined ? this.states[stateName] : '';
});
}
render(parentSelector) {
const parentElement = document.querySelector(parentSelector);
if (!parentElement) {
console.error(`Parent element "${parentSelector}" not found`);
return;
}
if (this.node) {
parentElement.appendChild(this.node);
} else {
console.error("No root node to render");
}
this.renderedOn = parentSelector;
}
updateState(state, value) {
if (this.states.hasOwnProperty(state)) {
this.states[state] = value;
this.reRender();
} else {
console.error(`State "${state}" does not exist`);
}
}
dispatchEvent(name) {
this.baseElement.main.node.dispatchEvent(new Event(name));
}
destroy() {
if (this.renderedOn) {
const parentElement = document.querySelector(this.renderedOn);
if (parentElement) {
parentElement.removeChild(this.node);
} else {
console.error("Route Element not found");
}
} else {
console.warn("the Component isnt rendered");
}
}
reRender() {
if (this.renderedOn) {
const parentElement = document.querySelector(this.renderedOn);
if (parentElement) {
parentElement.removeChild(this.baseElement.main.node);
this.baseElement = this.createElements(this.internalElements);
this.node = this.baseElement.main.node;
parentElement.appendChild(this.node);
}
}
}
}
class CopyComponent extends BaseComponent {
constructor(text, fullLabel="Copy Text") {
const copyElement = [
{
name: 'main',
type: 'button',
content: '{[fullLabel]}',
attr: {
class: 'btn btn-primary'
},
evt: [
{
name: 'click',
callback: () => {
navigator.clipboard.writeText(CopyComponent.states.text).then(() => copyComponent.dispatchEvent('coppyed')).catch((error) => console.error(error));
}
}
]
}
];
super(copyElement, {text: text, fullLabel: fullLabel});
}
}
