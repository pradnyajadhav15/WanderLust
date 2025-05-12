const data = require("./data")
const mongoose = require("mongoose");
const Listing = require("../models/listing");

mongoose
  .connect("mongodb://127.0.0.1:27017/wandernest")
  .then(() => console.log("MongoDb is connected"))
  .catch((e) => console.log("Error in Mongodb", e));

  const init = async()=>{

   await Listing.deleteMany({});
   let data2 = data.map((obj) => ({
     ...obj,
     owner: "67a42f27a43e3d313d101428",
     
   }));
   const allData = await Listing.insertMany(data2);
   console.log(allData);
  }

  init()