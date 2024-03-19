const express = require('express');
const app = express();
app.use(cors({
    origin: "https://team-dawgs.dokku.cse.lehigh.edu",
    methods: ["GET", "POST"]
}))