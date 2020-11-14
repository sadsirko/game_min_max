'use strict';

class Cell {
  constructor(num, x, y, a, b) {
    this.num = num;
    this.cheker = 'null';
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;
  }
}

class ChekArr {
  constructor(arr, drawMeth, listener) {
    this.arr = arr;
    this.zone = [];
    this.drawing = drawMeth;
    this.cell = { h: 60, w: 60 };
    this.LINES = 4;
    this.USABLE_CELL = 32;
    this.listen = listener;
    this.choosenCellNow = 0;
    this.choosenCellPrev = 19;
    this.flag = 1;
    this.specArrHeight = 7;
    this.specArrWidth = 8;
  }

  changeFlag(sym) {
    if (sym === '+') this.flag++;
    else this.flag--;
  }

  workWithSpecArr() {
    let numCell = 1;
    for (let i = 0; i < this.specArrHeight; i++) {
      this.arr[i] = [];
      for (let j = 0; j < this.specArrWidth; j++) {
        this.arr[i][j] = {};
      }
    }

    const side = this.cell.h;
    for (let j = 0; j < this.LINES; j++) {
      for (let i = 0; i < this.LINES; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;
        let dblSideI = 2 * side * i + side;
        let dblSideJ = 2 * side * j;
        const elem = new Cell(numCell, dblSideI, dblSideJ, a, b);
        dblSideI -= side;
        dblSideJ += side;
        const elem2 = new Cell(numCell + 4, dblSideI, dblSideJ, a, b - 1);
        this.arr[a][b] = elem;
        this.arr[a][b - 1] = elem2;
        numCell++;
      } numCell += 4;
    }
  }

  drawChekers() {
    const color = c => {
      switch (c.cheker) {
      case 'w': return this.drawing.drawCheker(c.x, c.y, 'w');
      case 'b': return this.drawing.drawCheker(c.x, c.y, 'b');
      case 'wRb': return this.drawing.drawchekerRb(c.x, c.y, 'w');
      case 'bRb': return this.drawing.drawchekerRb(c.x, c.y, 'b');
      }
    };

    for (let j = 0; j < this.LINES; j++) {
      for (let i = 0; i < this.LINES; i++) {
        const a = 0 + i + j;
        const b = this.LINES + i - j;
        const c = this.arr[a][b];
        const d = this.arr[a][b - 1];
        color(c);
        color(d);
      }
    }
  }
  // find by num the cell in arr of chekers
  findSpecAr(nn) {
    for (let j = 0; j < this.LINES; j++) {
      for (let i = 0; i < this.LINES; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;
        if (this.arr[a][b].num === nn) return this.arr[a][b];
        if (this.arr[a][b - 1].num === nn) return this.arr[a][b - 1];
      }
    }
    return null;
  }

  findZones() {
    let num = 1;
    let point = {};
    const side = this.cell.h;
    for (let i  = 0; i < this.specArrWidth; i++) {
      for (let j  = 0; j < this.LINES; j++) {
        this.zone[num] = { };
        point = { x: 2 * side * j, y: i * side  };
        if (i % 2 === 0)  point.x += side;
        this.zone[num] = point;
        num++;
      }
    }
  }

  findChoosedCell(relativeX, relativeY) {
    let buffer;
    for (let i = 1; i <= this.USABLE_CELL; i++) {
      const a = relativeX > this.zone[i].x;
      const b = relativeX < this.zone[i].x + this.cell.w;
      const c = relativeY > this.zone[i].y;
      const d = relativeY < this.zone[i].y + this.cell.w;
      if (a && b & c && d && i !== this.choosenCellNow) {
        this.choosenCellPrev = this.choosenCellNow;
        this.choosenCellNow = i;
      }
    }
    if (this.choosenCellNow !== buffer) buffer = this.choosenCellNow;
    return { now: this.choosenCellNow, pre: this.choosenCellPrev };
  }

  firstFilling() {
    const chekInLine = 4;
    const fillCell = (arr, a, b, col, pos1, pos2) => {
      const d = arr[a][b];
      const e = arr[a][b - 1];
      if (d.num <= pos2 && d.num >= pos1) d.cheker = col;
      if (e.num <= pos2 && e.num >= pos1) e.cheker = col;
    };

    for (let j = 0; j < chekInLine; j++) {
      for (let i = 0; i < chekInLine; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;
        fillCell(this.arr, a, b, 'bRb', 4, 4);
        fillCell(this.arr, a, b, 'w', 29, 32);
      }
    }
  }


}
