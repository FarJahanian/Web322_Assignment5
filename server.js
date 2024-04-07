const express = require("express");
const app = express();
const env = require("dotenv").config();
const legoService = require("./modules/legoSets"); // Import Lego service

const HTTP_PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.redirect("/sets");
});

// Route to display all Lego sets
app.get("/sets", async (req, res) => {
    try {
        const sets = await legoService.getAllLEGOSets();
        res.render('sets', { sets: sets });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

// Route to display a single Lego set by its set number
app.get("/sets/:set_num", async (req, res) => {
    try {
        const set = await legoService.getLEGOSetByNumber(req.params.set_num);
        res.render('set', { set: set });
    } catch (error) {
        res.status(404).send("Set not found");
    }
});

// Route to add a new Lego set
app.post("/sets/new", async (req, res) => {
    try {
        await legoService.addLEGOSet(req.body);
        res.redirect("/sets");
    } catch (error) {
        res.status(400).send("Error adding set: " + error.message);
    }
});

// Route to delete a Lego set
app.post("/sets/delete/:set_num", async (req, res) => {
    try {
        await legoService.deleteLEGOSet(req.params.set_num);
        res.redirect("/sets");
    } catch (error) {
        res.status(400).send("Error deleting set: " + error.message);
    }
});

// Route not found
app.use((req, res, next) => {
    res.status(404).send("404 - Page not found");
});

// Initialize Lego service and start server
legoService.bulkInsertLEGOData()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error initializing Lego service:", error);
    });
