const mongoose=require("mongoose");
const inidata=require('./data')
const Listing=require("../model/listing")
async function main(){
    await mongoose.connect("mongodb+srv://root:123@cluster0.kbwpgsu.mongodb.net/wonderlust")
}
main().then(()=>{
    console.log("conected litings added data")
}).catch((er)=>{
    console.log(er)
})

const iniDB=async()=>{
    await Listing.deleteMany({});
    inidata.data= inidata.data.map((obj)=>({...obj,owner:"6916c06acc730fe59d2c305b"}));
    await Listing.insertMany(inidata.data);
    console.log("data initialized");
}
iniDB();