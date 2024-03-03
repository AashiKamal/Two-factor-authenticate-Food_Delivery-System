const express = require("express")
const router = express.Router()


//for display data at the frontend
router.get('/foodData', async (req, res) => {
    try {
        // console.log( JSON.stringify(global.foodData))
        // const userId = req.user.id;
        // await database.listCollections({name:"food_items"}).find({});
   
        //  res.send([global.foodData, global.foodCategory])
        res.send([global.food_items,global.food_category]);
       
} catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
}) 
   
module.exports = router;
