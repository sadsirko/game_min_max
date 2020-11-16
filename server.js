'use strict';

const fs = require('fs');
const http = require('http');
const Websocket = require('websocket').server;
const clients = [];
let clientData = [];
const degh = 7;
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
    clientData.wolf.forEach(
      el => {
        resW.push(checkOpportunities(el.a, el.b, clientData.arr));
      }
    );
    //rabbit test
    const rb = clientData.rabbit[0];
    resB.push(checkOpportunities(rb.a, rb.b, clientData.arr));
    arrOpp = countOpportunity(clientData.arr);
    console.log(arrOpp);
    clients.forEach(client => {
      if (connection !== client) {
        client.send(JSON.stringify(clientData.arr));
      }
    });
  });

  connection.on('close', (reasonCode, description) => {
    console.log('Disconnected ' + connection.remoteAddress);
    console.dir({ reasonCode, description });
  });
});


function  findWolfsAdnRabb(cldata) {
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

//1 up;2-right;3-down;4-left
function checkOpportunities(a, b, arr) {
  const opportunities = [];
  opportunities.push({ a, b });
  const upW = { a: a - 1, b };
  const rightW = { a, b: b + 1 };
  const downW = { a: a + 1, b };
  const leftW = { a, b: b - 1 };
  //check ooport for Wolf
  if (arr[a][b].cheker === 'w') {
    if (arr[upW.a][upW.b].cheker === 'null')
      opportunities.push(upW);
    if (arr[rightW.a][rightW.b].cheker === 'null')
      opportunities.push(rightW);
  }
  //check opport for Rabbit
  if (arr[a][b].cheker === 'bRb') {
    if (arr[upW.a][upW.b].cheker === 'null')
      opportunities.push(upW);
    if (arr[rightW.a][rightW.b].cheker === 'null')
      opportunities.push(rightW);
    if (arr[downW.a][downW.b].cheker === 'null')
      opportunities.push(downW);
    if (arr[leftW.a][leftW.b].cheker === 'null')
      opportunities.push(leftW);
  }
  return opportunities;
}

function countOpportunity(situationArr) {
  let rbPos = { a: Infinity, b: Infinity };

  function createArray(arr, a = 7, b = 8) {
    for (let index = 0; index < a; index++) {
      arr[index] = [];
      for (let j = 0; j < b; j++) {
        if (situationArr[index][j].cheker) {
          arr[index][j] = { a: index, b: j, destination: Infinity };
          if (situationArr[index][j].cheker === 'bRb')
            rbPos = { a: index, b: j };
        } else
          arr[index][j] = null;
      }
    }
  }

  const newArr = [];
  createArray(newArr);
  newArr[rbPos.a][rbPos.b].destination = 0;
  let x = 1;
  let k = 0;
  let pos = [];
  let opport = [];
  let opp1 = [];
  const opp2 = [];
  opport = checkOpportunities(rbPos.a, rbPos.b, clientData.arr);
  opport.shift();
  //console.log(newArr);
  while (x < 10) {
    k = pos.length - 1;
    while (k >= 0) {
      opp1 = opport;
      //console.log(k);
      opport = opp1.concat(checkOpportunitiesRb(pos[k].a, pos[k].b, clientData.arr));
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
    const opportunities = [];
    opportunities.push({ a, b });
    const upW = { a: a - 1, b };
    const rightW = { a, b: b + 1 };
    const downW = { a: a + 1, b };
    const leftW = { a, b: b - 1 };
    //check opport for Rabbit
    if ( (upW.a > 0) && arr[upW.a][upW.b] && arr[upW.a][upW.b].cheker === 'null')
      opportunities.push(upW);
    if ( (rightW.b < 8) && arr[rightW.a][rightW.b] &&  arr[rightW.a][rightW.b].cheker === 'null')
      opportunities.push(rightW);
    if ( (downW.a < 7) &&   arr[downW.a][downW.b] && arr[downW.a][downW.b].cheker === 'null')
      opportunities.push(downW);
    if ( (leftW.b > 0) && arr[leftW.a][leftW.b] && arr[leftW.a][leftW.b].cheker === 'null')
      opportunities.push(leftW);
    return opportunities;
  }
}
