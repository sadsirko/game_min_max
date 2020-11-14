'use strict';

class Rules {
  constructor(desk, draw) {
    this.spec = desk;
    this.drawing = draw;
    this.LINES = 4;
  }

  fillPos(now, pre) {
    const a1 = this.spec.findSpecAr(now).a;
    const b1 = this.spec.findSpecAr(now).b;
    const a2 = this.spec.findSpecAr(pre).a;
    const b2 = this.spec.findSpecAr(pre).b;
    const pos = { a1, b1, a2, b2 };
    return pos;
  }

  fillDir(a1, b1, a2, b2, length) {
    const up =  (a2 - a1 === length && (b1 === b2));
    const down = (a1 - a2 === length && (b1 === b2));
    const left = (a1 === a2 && b1 - b2 === length);
    const right = (a1 === a2 && (b2 - b1 === length));
    const res = { up, down, left, right };
    return res;
  }

  ruleForStep(now, pre, clr) {
    const pos = this.fillPos(now, pre);
    const dir = this.fillDir(pos.a1, pos.b1, pos.a2, pos.b2, 1);
    const white = (clr === 'w' && (dir.up || dir.left));
    const black = (clr === 'b' && (dir.down || dir.right));
    const cr = (clr === 'Rb' && (dir.up || dir.down || dir.right || dir.left));
    if (white || black || cr) return true;
    return false;
  }
}
