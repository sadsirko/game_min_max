'use strict';

const fs = require('fs');
const http = require('http');
const Websocket = require('websocket').server;
const clients = [];
let clientData = [];
const degh = 7;
let desisions = [];
let arrOpp = [];

const server = http.createServer(async (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const [file] = url.substring(1).split('/');
  const path = `./${file}`;
  try {
    const data = await fs.promises.readFile(path);
    res.end(data);
  } catch (err) {
    res.statusCode = 404;
    res.end('"File is not found"');
  }
});


server.listen(8080, () => {
  console.log('Listen port 8080');
});

const ws = new Websocket({
  httpServer: server,
  autoAcceptConnections: false
});


ws.on('request', req => {
  const connection = req.accept('', req.origin);
  clients.push(connection);
  console.log('Connected ' + connection.remoteAddress);
  connection.on('message', message => {
    const dataName = message.type + 'Data';
    const data = message[dataName];
    clientData =  JSON.parse(data);

    clientData = findWolfsAdnRabb(clientData);
    //wolf test
    const resW = [];
    const resB = [];
    //console.log(clientData.arr);
    clientData.wolf.forEach(
      el => {
        resW.push(checkOpportunities(el.a, el.b, clientData.arr));
      }
    );
    //rabbit test
    const rb = clientData.rabbit[0];
    resB.push(checkOpportunities(rb.a, rb.b, clientData.arr));
    //console.log(resW);
    arrOpp = countOpportunity(clientData.arr);
    console.log(arrOpp);
    decideMoveW(clientData);

    clients.forEach(client => {
      client.send(JSON.stringify(clientData.arr));

    });
  });

  connection.on('close', (reasonCode, description) => {
    console.log('Disconnected ' + connection.remoteAddress);
    console.dir({ reasonCode, description });
  });
});

// change cldata.wolf and cldata.rabbit
function  findWolfsAdnRabb(cldata) {
  cldata.rabbit = [];
  cldata.wolf = [];
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (cldata.arr[a][b].cheker === 'bRb') {
        cldata.rabbit.push({ a, b });
      }
      if (cldata.arr[a][b - 1].cheker === 'bRb') {
        cldata.rabbit.push({ a, b: b - 1 });
      }

      if (cldata.arr[a][b].cheker === 'w') {
        cldata.wolf.push({ a, b });
      }
      if (cldata.arr[a][b - 1].cheker === 'w') {
        cldata.wolf.push({ a, b: b - 1 });
      }
    }
  }
  return cldata;
}

// where this thing can go now [[{a,b},{oa,ob,..}],[]]
function checkOpportunities(a, b, arr) {
  const opportunities = [];
  opportunities.push({ a, b });
  const upW = { a: a - 1, b };
  const rightW = { a, b: b + 1 };
  const downW = { a: a + 1, b };
  const leftW = { a, b: b - 1 };
  //check ooport for Wolf
  const locA = (upW.a > -1) && (rightW.b < 8);
  if (locA && arr[a][b].cheker && arr[a][b].cheker === 'w') {
    if (arr[upW.a][upW.b] && arr[upW.a][upW.b].cheker === 'null')
      opportunities.push(upW);
    if (arr[rightW.a][rightW.b] && arr[rightW.a][rightW.b].cheker === 'null')
      opportunities.push(rightW);
  }
  //check opport for Rabbit
  const locB = (downW.a < 7) && (leftW.b >= 0);
  if (locA && locB && arr[a][b].cheker === 'bRb') {
    if (arr[upW.a][upW.b] && arr[upW.a][upW.b].cheker === 'null')
      opportunities.push(upW);
    if (arr[rightW.a][rightW.b] && arr[rightW.a][rightW.b].cheker === 'null')
      opportunities.push(rightW);
    if (arr[downW.a][downW.b] && arr[downW.a][downW.b].cheker === 'null')
      opportunities.push(downW);
    if (arr[downW.a][downW.b] && arr[leftW.a][leftW.b].cheker === 'null')
      opportunities.push(leftW);
  }
  return opportunities;
}

// what is the function the best length (way)
function countOpportunity(situationArr) {
  let rbPos = { a: Infinity, b: Infinity };

  function createArray(arr, a = 7, b = 8) {
    for (let index = 0; index < a; index++) {
      arr[index] = [];
      for (let j = 0; j < b; j++) {
        if (situationArr[index][j].cheker) {
          arr[index][j] = { cheker: 'null',  a: index, b: j, destination: Infinity };
          if (situationArr[index][j].cheker === 'bRb') {
            arr[index][j] = { cheker: 'bRb', a: index, b: j, destination: 0 };
            rbPos = { cheker: 'bRb', a: index, b: j };
          }
          if (situationArr[index][j].cheker === 'w')
            arr[index][j] = { cheker: 'w', a: index, b: j, destination: Infinity };

        } else
          arr[index][j] = null;
      }
    }
    //console.log(arr);
  }

  const newArr = [];
  createArray(newArr);
  let x = 1;
  let k = 0;
  let pos = [];
  let opport = [];
  let opp1 = [];
  opport = checkOpportunities(rbPos.a, rbPos.b, newArr);


  // its ooport for Rabbit
  opport.shift();
  //console.log(opport);
  while (x < 30) {
    k = pos.length - 1;
    while (k >= 0) {
      opp1 = opport;
      //console.log(k);
      opport = opp1.concat(checkOpportunitiesRb(pos[k].a, pos[k].b, newArr));
      k--;
    }


    opport.forEach(el => {
      if (x < newArr[el.a][el.b].destination)
        newArr[el.a][el.b].destination = x;
    });
    pos = forRecArray(x, newArr);
    //console.log(newArr);
    x++;
    opport = [];
  }
  // console.log(newArr);

  return newArr;

  function forRecArray(num, arr, a = 7, b = 8) {
    const res = [];
    for (let index = 0; index < a; index++) {
      for (let j = 0; j < b; j++) {
        if (arr[index][j] != null) {
          if (arr[index][j].destination === num) {
            res.push({ a: index, b: j });
          }
        }
      }
    }
    return res;
  }

  function checkOpportunitiesRb(a, b, arr) {
    arr[a][b];
    const opportunities = [];
    const upW = { a: a - 1, b };
    const rightW = { a, b: b + 1 };
    const downW = { a: a + 1, b };
    const leftW = { a, b: b - 1 };
    //check opport for Rabbit
    if ((upW.a > -1) && arr[upW.a][upW.b] && arr[upW.a][upW.b].cheker === 'null')
      opportunities.push(upW);
    if ((rightW.b < 8) && arr[rightW.a][rightW.b] &&  arr[rightW.a][rightW.b].cheker === 'null')
      opportunities.push(rightW);
    if ((downW.a < 7) &&   arr[downW.a][downW.b] && arr[downW.a][downW.b].cheker === 'null')
      opportunities.push(downW);
    if ((leftW.b >= 0) && arr[leftW.a][leftW.b] && arr[leftW.a][leftW.b].cheker === 'null')
      opportunities.push(leftW);
    return opportunities;
  }
}


function decideMoveW(clientData) {

  const res = [];
  let arrLoc = [];
  let opWolf = [];
  const dectinationToEnd = [];
  let move;
  clientData = findWolfsAdnRabb(clientData);
  arrLoc = createArray(clientData.arr);
  const locA = clientData.rabbit[0];
  if (locA === { a: 3, b: 0 } ||
      locA === { a: 6, b: 3 } ||
      locA === { a: 4, b: 1 } ||
      locA === { a: 5, b: 2 })
    return 'winOfRabbit';
  clientData.wolf.forEach(
    el => {
      res.push(checkOpportunities(el.a, el.b, arrLoc));
    }
  );

  console.log(res);
  opWolf = countOpportunity(arrLoc);
  //console.log(opWolf);
  //console.log(minToEnd(opWolf));
  move = findMax(res, opWolf, arrLoc);

  clientData.arr[move.a1][move.b1].cheker = 'null';
  clientData.arr[move.a2][move.b2].cheker = 'w';

  function findMax(wCan, opWolf, arrL) {
    let tmp;
    let a1, a2, b1, b2;
    const max = { a1, a2, b1, b2, max: 0 };
    for (let i = 0; i < wCan.length; i++) {
      for (let j = 1; j < wCan[i].length; j++) {
        arrL[wCan[i][0].a][wCan[i][0].b].cheker = 'null';
        arrL[wCan[i][j].a][wCan[i][j].b].cheker = 'w';
        opWolf = countOpportunity(arrL);
        arrL[wCan[i][0].a][wCan[i][0].b].cheker = 'w';
        arrL[wCan[i][j].a][wCan[i][j].b].cheker = 'null';
        tmp = minToEnd(opWolf);
        //console.log(tmp);
        //sconsole.log(opWolf);
        if (max.max < tmp) {
          max.a1 = wCan[i][0].a, max.a2 = wCan[i][j].a,
          max.b1 = wCan[i][0].b, max.b2 = wCan[i][j].b;
          max.max = tmp;
        }
      }
    }
    return max;
  }

  function minToEnd(opWolf) {
    const arrL = [];
    let min = Infinity;
    arrL.push(opWolf[3][0].destination);
    arrL.push(opWolf[4][1].destination);
    arrL.push(opWolf[5][2].destination);
    arrL.push(opWolf[6][3].destination);
    min = findmin(arrL);
    console.log(arrL);
    return min;
  }

  function findmin(arr) {
    let mini = Infinity;
    for (const i of arr) {
      if (mini > i)
        mini = i;
    }
    return mini;
  }


  function createArray(situationArr, a = 7, b = 8) {
    const arr = [];
    for (let index = 0; index < a; index++) {
      arr[index] = [];
      for (let j = 0; j < b; j++) {
        if (situationArr[index][j].cheker) {
          arr[index][j] = { cheker: 'null', a: index, b: j, destination: Infinity };
          if (situationArr[index][j].cheker === 'bRb')
            arr[index][j] = { cheker: 'bRb', a: index, b: j, destination: 0 };
          if (situationArr[index][j].cheker === 'w')
            arr[index][j] = { cheker: 'w', a: index, b: j, destination: Infinity };
        } else
          arr[index][j] = {};
      }
    }
    return arr;
  }
}

Class Des {
  constructor(){

  }
}