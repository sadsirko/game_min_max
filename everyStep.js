'use strict';

function everyStep(drawing, rule, spec, mover, choosCellNow, choosCellPrev) {
  drawing.drawDesk();
  drawing.druwTurn(spec.flag);



  const makeMove = (flag, col, colRb, antCl, char) => {
    if (spec.findSpecAr(choosCellPrev) && flag) {
      const cBool = spec.findSpecAr(choosCellPrev).cheker === col;
      const aBool = spec.findSpecAr(choosCellPrev).cheker === colRb;
      if (cBool || aBool) {
        mover.moveRabbit(choosCellNow, choosCellPrev, col, antCl, colRb, spec.flag);
        mover.moveWolf(choosCellNow, choosCellPrev, col, antCl, spec.flag);
        if (spec.findSpecAr(choosCellPrev).cheker === 'null') {
          spec.changeFlag(char);
          socket.send(JSON.stringify(spec));
        }
      }
      // spec.chekOnRbown();
    }
  };

  makeMove(spec.flag, 'w', 'wRb', 'b', '-');
  makeMove(!spec.flag, 'b', 'bRb', 'w', '+');
  // console.table(spec.arr);
  //console.log(spec.arr[0][3]);
  spec.drawChekers();

}
