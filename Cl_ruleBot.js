'use strict';

class RulesForBot {
  constructor(desk) {
    this.spec = desk;
    this.LINES = 4;
  }



  ruleForStep(poss, clr) {
    const dir = this.fillDir(pos.a1, pos.b1, pos.a2, pos.b2, 1);
    const white = (clr === 'w' && (dir.up || dir.right));
    const cr = (clr === 'Rb' && (dir.up || dir.down || dir.right || dir.left));
    if (white || cr) return true;
    return false;
  }
}
module.exports = RulesForBot;