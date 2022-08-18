require('dotenv').config();
var express = require('express');
var bodyParser=require('body-parser');
var app = express();
var mongoose=require('mongoose');
require('./myschema.js');
const shortIt =require('./shorten.js');
const elongeIt =require('./elongate.js');
const pastRecords=require('./pastRecords.js')
const pastRecordsInInterval=require('./pastRecordsInInterval.js');
const Entry=mongoose.model('Entry');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/shorten',async function(req,res){
    res.json({"url": await shortIt.short(req.body.url)});
});

app.get("/elongate",async function(req,res){
    var originalUrl=await elongeIt.getOriginalUrl(req.query.url);
    if(originalUrl=="Not shorted from this site please enter correct url.")
    {
        res.json({"url":originalUrl});
        res.end();
    }
    else{
        res.redirect(originalUrl);
    }
});

app.get('/pastrecords',async function(req,res){
    var recordsFectched=await pastRecords.getRecords(req.query.days);
    if(recordsFectched=="No records for this day.")
    {
        res.json({"Records":recordsFectched});
        res.end();
    }
    else
    {
        res.json({"Records":recordsFectched});
    }
});
app.get('/pastrecordsininterval',async function(req,res){
    var recordsFectched=await pastRecordsInInterval.getRecords(req.query.startDate,req.query.endDate);
    if(recordsFectched=="No records for given interval")
    {
        res.json({"Records":recordsFectched});
        res.end();
    }
    else
    {
        res.json({"Records":recordsFectched});
    }
});
console.log("Running...")
app.listen(3000);
