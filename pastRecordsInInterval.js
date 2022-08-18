var mongoose=require('mongoose');
require('./myschema.js');
const Entry=mongoose.model('Entry');

const getRecords=async function(start,end){
    var startDate=new Date(start);
    var endDate=new Date(end);
    const data=await Entry.find({date:{$gte:startDate,$lte:endDate}});
    if(data.length==0)
    {
        return "No records for given interval";
    }
    else
    {
        return data;
    }
}
module.exports.getRecords=getRecords;