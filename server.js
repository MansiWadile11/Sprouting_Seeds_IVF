// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Unified form submission route
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    const formType = formData.formType || 'unknown';

    const dataToStore = {
        formType,
        ...formData,
        submittedAt: new Date().toISOString()
    };

    let submissions = [];
    const filePath = 'submissions.json';
    if (fs.existsSync(filePath)) {
        submissions = JSON.parse(fs.readFileSync(filePath));
    }

    submissions.push(dataToStore);

    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
    res.json({ message: `${formType} form submitted successfully!` });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
