'use strict';

class Listener {
  constructor() {
    this.relativeY;
    this.relativeX;
    this.now;
    this.pre;
  }
  mousedown(e) {
    this.relativeY = e.clientY;
    this.relativeX =  e.clientX;
    this.now = spec.findChoosedCell(this.relativeX, this.relativeY).now;
    this.pre = spec.findChoosedCell(this.relativeX, this.relativeY).pre;
    everyStep(drawing, rule, spec, mover, this.now, this.pre);
  }
  mouseup() {
    everyStep(drawing, rule, spec, mover, this.now, this.pre);
  }
}
