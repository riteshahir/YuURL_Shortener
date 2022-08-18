require('./myschema.js');
var mongoose=require('mongoose');
require('./myschema.js');
const Entry=mongoose.model('Entry');

async function checkValidity(inputUrl){
    var regex=/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if(regex.test(inputUrl)==false)
        return false;
    return true;
}

async function generateRandomUrl()
{
    var randomString="";
    var possibilities="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var poslen=possibilities.length;
    for(var i=0;i<7;i++)
    {
        randomString+=possibilities.charAt(Math.floor(Math.random()*poslen));
    }
    var url="localhost:3000/"+randomString;
    return url;
}

async function checkRandomUrl(urlToSend){
    var data=await Entry.find({shortenurl:urlToSend});
    if(data.length==0)
        return false;
    return true;
}

async function generateUrl()
{
    var urlToSend=await generateRandomUrl();
    var flag=true;
    while(flag)
    {
        var isShortenUrlAlreadyGenerated=await checkRandomUrl(urlToSend);
        if(isShortenUrlAlreadyGenerated==true)
        {
            urlToSend=await generateRandomUrl();
        }
        else
        {
            flag=false;
        }
    }
    return urlToSend;
}
async function calculateMonth(val){
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    return monthNames[val];
}
var short=async function(inputUrl){
    var isvalid=await checkValidity(inputUrl);
    if(isvalid==false)
    {
        return "You have entered Wrong url";
    }
    else
    {
        const data=await Entry.find({url:inputUrl});
        if(data.length==0)
        {
            var shortUrl=await generateUrl();
            var newEntry=new Entry();
            newEntry.url=inputUrl;
            newEntry.shortenurl=shortUrl;
            newEntry.count=1;

            var todayDate=new Date();
            var d=todayDate.getDate();
            var m=await calculateMonth(todayDate.getMonth());
            var y=todayDate.getFullYear();
            var dateString=m+' '+d+','+y;
            var dateToStore=new Date(dateString);

            newEntry.date=dateToStore;

            var newData=await newEntry.save();
            return shortUrl;
        }
        else
        {
            var shortUrl=data[0]["shortenurl"];
            var prevcount=data[0]["count"];

            var todayDate=new Date();
            var d=todayDate.getDate();
            var m=await calculateMonth(todayDate.getMonth());
            var y=todayDate.getFullYear();
            var dateString=m+' '+d+','+y;
            var dateToStore=new Date(dateString);

            await Entry.findOneAndUpdate({url:inputUrl},{count:prevcount+1,date:dateToStore},{new:true});
            return shortUrl;
        }
    }
}
module.exports.short=short;