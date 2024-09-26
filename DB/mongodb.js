const { MongoClient } = require("mongodb");

// Replace the URI string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://raj:kbClnaydvHBouCYJ@cluster0.hfgmlqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let coll;

const connectDB = async () => {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db("User");
    coll = db.collection("profile");  // Assign the collection globally
    console.log("Connected successfully to MongoDB");
    return client;
  } catch (err) {
    console.error("DBD-err-", err);
    throw err;
  }
};

// Export the connection function and the collection getter
const getCollection = () => {
  if (!coll) {
    throw new Error("Collection not initialized. Did you forget to connect?");
  }
  return coll;
};

module.exports = { connectDB, getCollection };




/*const  {MongoClient}  = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://raj:kbClnaydvHBouCYJ@cluster0.hfgmlqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let coll;
const connectDB=async() => {

    try {
        // Connect to the database
        const c=await client.connect();
        const db = client.db("User");
        const coll = db.collection("profile");
        console.log("Connected successfully to MongoDB");
        return db
      }
       catch (err) 
       {
        console.error("DBD-err-", err);
        throw err; // Throw the error to catch in your main app
      }
    };


//   try {
//      await client.connect();
//     // database and collection code goes here
//     // find code goes here
//     // iterate code goes here
//   }
  
//   catch(err){
//     console.log("DBD-err-",err)
//   }
//   finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
//run().catch(console.dir);

// database and collection code goes here

module.exports={connectDB,getCollection:()=>coll}


*/


// const mongodb=require("mongoose")

// //kbClnaydvHBouCYJ

// const connectDB=async()=>{
//     try{
//         const client=new mongodb("mongodb+srv://raj:kbClnaydvHBouCYJ@cluster0.hfgmlqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
//         await client.connect()

//         // return await mongodb.connect("mongodb+srv://raj:kbClnaydvHBouCYJ@cluster0.hfgmlqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
//         //     {
                
//         //         useNewUrlParser: true,
//         //         useUnifiedTopology: true
//         //     })
//         //  }

//     catch(err){
//         console.error('Error connecting to the database:', err);
//         process.exit(1);

//     }
//     }

// const user=new mongodb.Schema({
//     email:String,
//     password:String,
//     age:Number
// })

// const model= mongodb.model("User",user)


// module.exports={model,connectDB}
