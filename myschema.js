require('dotenv').config();
var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/mydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(() => {
    console.log(`mongodb connection is ready : ${mongoose.connection.readyState}`);
});
mongoose.set('useFindAndModify', false);
const Schema=mongoose.Schema;

const urlSchema= new Schema({
    url: String,
    shortenurl: String,
    count: Number,
    date: Date
});

const Entry=mongoose.model('Entry', urlSchema, "url_collection");
module.exports=Entry;