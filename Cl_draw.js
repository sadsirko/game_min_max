'use strict';

class Draw {
  constructor(canvas, turncanvas) {
    this.CHEKER_R = 25;
    this.cell = { h: 60, w: 60 };
    this.canv = canvas;
    this.turncanvas = turncanvas;
    this.ctx = canvas.getContext('2d');
    this.ctxturn = turncanvas.getContext('2d');
    this.turnCellW = 80;
    this.diffRad = 5;
  }

  drawDeskCells(x, y) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, this.cell.h, this.cell.w);
    this.ctx.fillStyle = '#464d65';
    this.ctx.fill();
    this.ctx.closePath();
  }e7ecfb

  drawCheker(x, y, color) {
    const xR = x + this.cell.w / 2;
    const yR = y + this.cell.h / 2;

    this.ctx.beginPath();
    this.ctx.arc(xR, yR, this.CHEKER_R, 0, Math.PI * 2, false);
    if (color === 'b')
      this.ctx.fillStyle = 'black';
    else
      this.ctx.fillStyle = '#464d65';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawchekerRb(x, y, color) {
    const xR = x + this.cell.w / 2;
    const yR = y + this.cell.h / 2;
    this.ctx.beginPath();
    this.ctx.arc(xR, yR, this.CHEKER_R, 0, Math.PI * 2, false);
    if (color === 'b')
      this.ctx.fillStyle = 'black';
    else
      this.ctx.fillStyle = '#e8e8e8';
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.arc(xR, yR, this.CHEKER_R - this.diffRad, 0, Math.PI * 2, false);
    this.ctx.fillStyle = '#e8e8e8';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawDesk() {
    this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    for (let xCell = 0; xCell < this.canv.width; xCell += 2 * this.cell.w) {
      for (let yCell = 0; yCell < this.canv.height; yCell += 2 * this.cell.h) {
        this.drawDeskCells(xCell, yCell);
        this.drawDeskCells(xCell + this.cell.h, yCell + this.cell.w);
      }
    }
  }

  druwTurn(flag) {
    const pos = this.turncanvas.width / 2;

    this.ctxturn.clearRect(0, 0, this.turnCellW, this.turnCellW);
    this.ctxturn.beginPath();
    this.ctxturn.arc(pos, pos, pos - this.diffRad, 0, Math.PI * 2, false);
    if (!flag) this.ctxturn.fillStyle = '#e8e8e8';
    else  this.ctxturn.fillStyle = '#464d65';
    this.ctxturn.fill();
    this.ctxturn.closePath();
  }
}
