var mongoose=require('mongoose');
require('./myschema.js');
const Entry=mongoose.model('Entry');

async function calculateMonth(val){
    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    return monthNames[val];
}

var getRecords=async function(pastDays){

    var todayDate=new Date();
    var d=todayDate.getDate();
    var m= await calculateMonth(todayDate.getMonth());
    var y=todayDate.getFullYear();
    var dateString=m+' '+d+','+y;
    var dateToWorkWith=new Date(dateString);
    let pastDate = new Date(dateToWorkWith.valueOf() -  pastDays*1000*60*60*24);
    const data=await Entry.find({date:pastDate});
    if(data.length==0)
    {
        return "No records for this day.";
    }
    else
    {
        return data;
    }

}

module.exports.getRecords=getRecords;