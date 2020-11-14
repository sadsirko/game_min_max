'use strict';

const arr = [];
const drawing = new Draw(canvas,turncanvas);
const listen = new Listener();
const spec =  new ChekArr(arr, drawing, listen);
const rule = new Rules(spec, drawing);
const mover = new Move(spec, drawing, rule);
canvas.addEventListener('mousedown', listen.mousedown, false);
canvas.addEventListener('mouseup', listen.mouseup, false);

const socket = new WebSocket('ws://127.0.0.1:8080/');

socket.onopen = () => {
  console.log('connected');
};

socket.onerror = err => {
  console.log(err);
};

socket.onclose = () => {
  console.log('closed');
};

socket.onmessage = event => {
  spec.arr =  JSON.parse(event.data);
  if (spec.flag) spec.changeFlag('-');
  else spec.changeFlag('+');
  everyStep(drawing, rule, spec, mover);
};


