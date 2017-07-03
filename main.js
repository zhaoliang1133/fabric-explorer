/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */
var express = require("express");
var path = require('path');
var app = express();
var http= require('http').Server(app);
var bodyParser = require('body-parser');

require('./socket/websocketserver.js')(http)

var timer=require('./timer/timer.js')
timer.start()


var query=require('./app/query.js');
var ledgerMgr=require('./utils/ledgerMgr.js')

var statusMertics=require('./service/metricservice.js')

app.use(express.static(path.join(__dirname,'explorer_client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var query=require('./app/query.js')

// =======================   控制器绑定  ===================

app.post("/api/tx/getinfo", function(req, res) {

    let  txid = req.body.txid



    if( txid != '0' ){
    query.getTransactionByID('peer1',ledgerMgr.getCurrChannel(),txid,'admin','org1').then(response_payloads=>{

        var header = response_payloads['transactionEnvelope']['payload']['header']
        var data = response_payloads['transactionEnvelope']['payload']['data']
        var signature = response_payloads['transactionEnvelope']['signature'].toString("hex")

        res.send({
            'tx_id':header.channel_header.tx_id,
            'timestamp':header.channel_header.timestamp,
            'channel_id':header.channel_header.channel_id,
            'type':header.channel_header.type,
        })
    })

    }else{
        res.send({ })
    }


});

app.post("/api/tx/json", function(req, res) {

    let  txid = req.body.number



    if( txid != '0' ){
        query.getTransactionByID('peer1',ledgerMgr.getCurrChannel(),txid,'admin','org1').then(response_payloads=>{

            var header = response_payloads['transactionEnvelope']['payload']['header']
            var data = response_payloads['transactionEnvelope']['payload']['data']
            var signature = response_payloads['transactionEnvelope']['signature'].toString("hex")

            var blockjsonstr = JSON.stringify(response_payloads['transactionEnvelope'])

            res.send(blockjsonstr)

        })

    }else{

        res.send({ })

    }

});

app.post("/api/block/json", function(req, res) {

    let number=req.body.number
    query.getBlockByNumber('peer1',ledgerMgr.getCurrChannel(),parseInt(number),'admin','org1').then(block=>{

        var blockjsonstr = JSON.stringify(block)

        res.send(blockjsonstr)
    })
});


app.post("/api/block/getinfo", function(req, res) {

    let number=req.body.number
    query.getBlockByNumber('peer1',ledgerMgr.getCurrChannel(),parseInt(number),'admin','org1').then(block=>{
        res.send({
            'number':block.header.number.toString(),
            'previous_hash':block.header.previous_hash,
            'data_hash':block.header.data_hash,
            'transactions':block.data.data
        })
    })
});

app.post("/api/block/get", function(req, res) {
    let number=req.body.number
    query.getBlockByNumber('peer1',ledgerMgr.getCurrChannel(),parseInt(number),'admin','org1').then(block=>{
        res.send({
            'number':number,
            'txCount':block.data.data.length
        })
    })
});

//return latest status
app.post("/api/status/get", function(req, res) {
    statusMertics.getStatus(ledgerMgr.getCurrChannel(),function(status){
        res.send(status)
    })
});

app.post('/chaincodelist',function(req,res){
    statusMertics.getTxPerChaincode(ledgerMgr.getCurrChannel(),function (data) {
        console.info(data)
        res.send(data)
    })
})

app.post('/changeChannel',function(req,res){
    let channelName=req.body.channelName
    ledgerMgr.changeChannel(channelName)
})

app.post('/curChannel',function(req,res){
    res.send(ledgerMgr.getCurrChannel())
})

app.post('/channellist',function(req,res){
    res.send(ledgerMgr.getChannellist())
})


// ============= 启动服务器 =======================

var server = http.listen(8080, function() {
    console.log("请在浏览器访问：http://localhost:8080/");
});





