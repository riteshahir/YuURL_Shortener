var mongoose=require('mongoose');
require('./myschema.js');
const Entry=mongoose.model('Entry');

async function calculateMonth(val){
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    return monthNames[val];
}

var getOriginalUrl= async function(urlToSearch){
    const data=await Entry.find({shortenurl:urlToSearch});
    if(data.length==0)
    {
        return "Not shorted from this site please enter correct url.";
    }
    else
    {
        var respondUrl=data[0]["url"];
        var prevCount=data[0]["count"];
        var todayDate=new Date();
        var d=todayDate.getDate();
        var m=await calculateMonth(todayDate.getMonth());
        var y=todayDate.getFullYear();
        var dateString=m+' '+d+','+y;
        var dateToStore=new Date(dateString);

        const newdata=await Entry.findOneAndUpdate({shortenurl:urlToSearch},{count:prevCount+1,date:dateToStore},{new:true});
        return respondUrl;
    }
}
module.exports.getOriginalUrl=getOriginalUrl;