'use strict';

class Move {
  constructor(arr, draw, rules) {
    this.spec = arr;
    this.drawing = draw;
    this.rule = rules;
  }

  moveWolf(now, pre, you, enemy) {
    const c = this.rule.ruleForStep(now, pre, you);
    const nowCh = this.spec.findSpecAr(now).cheker;
    const preCh = this.spec.findSpecAr(pre).cheker;

    if (preCh === you && nowCh === 'null' && c) {
      this.spec.findSpecAr(now).cheker = you;
      this.spec.findSpecAr(pre).cheker = 'null';
    }
  }

  moveRabbit(now, pre, you, enemy, youRb) {

    const a = this.spec.findSpecAr(now).cheker;
    const b = this.spec.findSpecAr(pre).cheker;
    const c = this.rule.ruleForStep(now, pre, 'Rb');

    if (a === 'null' && b === youRb && c) {
      this.spec.findSpecAr(now).cheker = youRb;
      this.spec.findSpecAr(pre).cheker = 'null';
    }
  }
}
