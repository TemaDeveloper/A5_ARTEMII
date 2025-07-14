/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work and completed based on my
* current understanding of the course concepts.
*
* The assignment was completed in accordance with:
* a. The Seneca's Academic Integrity Policy
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* b. The academic integrity policies noted in the assessment description
*
* I did NOT use generative AI tools (ChatGPT, Copilot, etc) to produce the code
* for this assessment.
*
* Name: Artemii Fridriksen Student ID: 174141234
*
********************************************************************************/



const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms
require("dotenv").config()   


// +++ Database connection code
// +++ TODO: Remember to add your Neon.tech connection variables to the .env file!!
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// +++  4. TODO: Define your database table
const Location = sequelize.define('Location', {
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: false 
});



// +++ 5. TODO: Define your server routes
// GET route for the home page 
app.get("/", async (req, res) => {
    try {
        const locations = await Location.findAll({ raw: true });
        res.render("home.ejs", { locations: locations }); // Pass locations to the view 
    } catch(err) {
        console.log(err);
        res.status(500).send("Error fetching locations");
    }
});

app.get("/memories/add", (req, res) => {
    res.render("add.ejs");
});

app.post("/memories/add", async (req, res) => {
    try {
        // req.body contains the form data (name, address, etc.)
        await Location.create(req.body);
        res.redirect("/"); // Redirect to the home page after adding 
    } catch(err) {
        console.log(err);
        res.status(500).send("Error adding new location.");
    }
});

// GET route to delete a location 
app.get("/memories/delete/:id", async (req, res) => {
    try {
        await Location.destroy({
            where: { id: req.params.id }
        });
        res.redirect("/"); // Redirect to the home page after deletion 
    } catch(err) {
        console.log(err);
        res.status(500).send("Error deleting location.");
    }
});

// +++  Function to start serer
async function startServer() {
    try {
        await sequelize.sync();
        console.log("SUCCESS connecting to database and syncing model.");

        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: http://localhost:${HTTP_PORT}`);
        });
    }
    catch (err) {
        console.log("ERROR connecting to database");
        console.log(err);
        console.log("Please resolve these errors and try again.");
    }
}

startServer()



