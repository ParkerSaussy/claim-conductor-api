/* 

Here is our primary server wherein we'll set up our webhook/HTTP endpoints. 

If I get to the frontend portion, I'll also host the static build of that here.

Sample Webhooks to copy-paste:
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonAdded", "payload_content": {"person_id": "9fdfefc3-d7d6-46bc-aca7-870aa91b150e", "name": "Person 977", "timestamp": "2024-05-23T19:00:46.593935Z"}}' http://localhost:3000/accept_webhook
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonRenamed", "payload_content": {"person_id": "291b1c35-47fe-43fb-b673-9f2094ddd798", "name": "Renamed Person 5322", "timestamp": "2024-05-23T19:00:36.315931Z"}}' http://localhost:3000/accept_webhook
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonRemoved", "payload_content": {"person_id": "8c5ee099-e894-43f7-b62e-32460138f1b9", "timestamp": "2024-05-23T19:41:10.884707Z"}}' http://localhost:3000/accept_webhook

*/


const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const bodyParser = require('body-parser');

// Initialize express app and configure w/ body-parser
const app = express();
app.use(bodyParser.json());


app.post('/accept_webhook', (req, res) => {
    let status = 200;
    let description;

    // Initial check for the body
    if (!req.body) {
        status = 500;
        description = 'Invalid Input';
    }

    const payload = req.body.payload_content;
    switch(req.body?.payload_type) {
        /* 
        First next step I'd take is somehow auto-validating via our Yaml schema, vs. manually checking the data.
        */
        case 'PersonAdded':
            if (payload?.person_id && payload?.name && payload?.timestamp) {

            } else {
                status = 400;
                description = 'Invalid Input';
            }
            break;
        case 'PersonRenamed':
            if (payload?.person_id && payload?.name && payload?.timestamp) {
                
            } else {
                status = 400;
                description = 'Invalid Input';
            }
            break;
        case 'PersonRemoved':
            if (payload?.person_id && payload?.timestamp) {
                
            } else {
                status = 400;
                description = 'Invalid Input';
            }
            break;
        default:
            status = 400;
            description = 'Invalid Input';
    }

    if (status === 500) description = 'Server Error';
    res.send({ status, description });
});

app.get('/get_name', (req, res) => {

});


const port = 3000; // I typically use 9000 since I often use GraphQL, but any will do here
app.listen(3000, () => {
    console.log(`Server is running on port ${port}`);
});