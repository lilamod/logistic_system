const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(()=>{
    console.log("connected successfully");
  })
  .catch(err =>{
    console.log("not connected",err)
  })


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
