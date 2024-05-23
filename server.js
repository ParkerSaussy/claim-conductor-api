/* 

Here is our primary server wherein we'll set up our webhook/HTTP endpoints. 

If I get to the frontend portion, I'll also host the static build of that here.

Sample Webhooks to copy-paste:
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonAdded", "payload_content": {"person_id": "9fdfefc3-d7d6-46bc-aca7-870aa91b150e", "name": "Person 977", "timestamp": "2024-05-23T19:00:46.593935Z"}}' http://localhost:3000/accept_webhook
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonRenamed", "payload_content": {"person_id": "291b1c35-47fe-43fb-b673-9f2094ddd798", "name": "Renamed Person 5322", "timestamp": "2024-05-23T19:00:36.315931Z"}}' http://localhost:3000/accept_webhook
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonRemoved", "payload_content": {"person_id": "8c5ee099-e894-43f7-b62e-32460138f1b9", "timestamp": "2024-05-23T19:41:10.884707Z"}}' http://localhost:3000/accept_webhook

*/
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs'; // We use this to load our secrets file
import Sequelize from './lib/Sequelize.js';
import { 
    createPerson, 
    renamePerson, 
    deletePerson, 
    getPerson 
} from './lib/crud.js';


// Load our secrets file. All we have is prod - if we had a real dev server or db, we'd have separate secrets for that as well
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const prod = loadJSON('./secrets/prod.json'); // All this contains as of now is our Database connection string; we'd add other API keys here as well later

// Initialize express app and configure w/ body-parser
const app = express();
app.use(bodyParser.json());

// Initialize the DB structure via our sequelize class
// Note that this effectively remakes the DB every time it runs, though it's non-destructive (i.e. only adds new fields)
const db = new Sequelize(prod.dbConnectionString);
const models = db.sequelize.models;

const responses = {
    200: 'Webhook processed successfully',
    400: 'Invalid input',
    500: 'Server error'
}

app.post('/accept_webhook', async (req, res) => {
    let status = 200;
    let description;

    // Initial check for the body & payload content
    if (!req.body || !req.body.payload_content) {
        status = 500;
        description = 'Invalid Input';
    }

    const payload = req.body.payload_content;
    /* 
    First next step I'd take is somehow auto-validating via our Yaml schema, vs. manually checking the data.
    */
    switch(req.body?.payload_type) {
        case 'PersonAdded':
            if (payload?.person_id && payload?.name && payload?.timestamp) {
                let res = await createPerson(models, payload)
                if (res.success) {
                    status = 200;
                    description = responses[status];
                } else {
                    status = 500;
                    description = responses[status];
                }
            } else {
                status = 400;
                description = responses[status];
            }
            break;
        case 'PersonRenamed':
            if (payload?.person_id && payload?.name && payload?.timestamp) {
                let res = await renamePerson(models, payload)
                if (res.success) {
                    status = 200;
                    description = responses[status];
                } else {
                    status = 500;
                    description = responses[status];
                }
            } else {
                status = 400;
                description = responses[status];
            }
            break;
        case 'PersonRemoved':
            if (payload?.person_id && payload?.timestamp) {
                let res = await deletePerson(models, payload)
                if (res.success) {
                    status = 200;
                    description = responses[status];
                } else {
                    status = 500;
                    description = responses[status];
                }
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