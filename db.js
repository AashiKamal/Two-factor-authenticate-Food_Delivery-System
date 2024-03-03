const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://FOODSYSTEM:ctyuiok@cluster0.0saqsom.mongodb.net/GoFoodMern?retryWrites=true&w=majority';

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true });
    console.log('Connected to MongoDB');

    const fetchedData = await mongoose.connection.db.collection("food_items");
    const foodItems = await fetchedData.find({}).toArray();

    const fetchedCategories = await mongoose.connection.db.collection("food_category");
    const categories = await fetchedCategories.find({}).toArray();
    global.food_items = foodItems;
    global.food_category = categories;
    //  console.log('Food Items fetched:', foodItems);
    //  console.log('Categories fetched:', categories);

    return { foodItems, categories };
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
};

module.exports = mongoDB;