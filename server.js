/* 

Here is our primary server wherein we'll set up our webhook/HTTP endpoints. 

If I get to the frontend portion, I'll also host the static build of that here.

Sample Webhooks to copy-paste:
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonAdded", "payload_content": {"person_id": "9fdfefc3-d7d6-46bc-aca7-870aa91b150e", "name": "Person 977", "timestamp": "2024-05-23T19:00:46.593935Z"}}' http://localhost:3000/accept_webhook
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonRenamed", "payload_content": {"person_id": "291b1c35-47fe-43fb-b673-9f2094ddd798", "name": "Renamed Person 5322", "timestamp": "2024-05-23T19:00:36.315931Z"}}' http://localhost:3000/accept_webhook
curl -X POST -H "Content-Type: application/json" -d '{"payload_type": "PersonRemoved", "payload_content": {"person_id": "8c5ee099-e894-43f7-b62e-32460138f1b9", "timestamp": "2024-05-23T19:41:10.884707Z"}}' http://localhost:3000/accept_webhook
curl -X GET -H "Content-Type: application/json" -d '{"payload_type": "GetNameResponse", "payload_content": {"person_id": "8c5ee099-e894-43f7-b62e-32460138f1b9" }}' http://localhost:3000/get_name
*/

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs'; // We use this to load our secrets file
import Sequelize from './lib/Sequelize.js';
import { 
    createPerson, 
    renamePerson, 
    deletePerson, 
    getPersonName,
    getAllPeople
} from './lib/crud.js';
// V2 IMPORTS
import {
    createPerson_v2,
    renamePerson_v2,
    deletePerson_v2,
    getPersonName_v2,
    getAllPeople_v2
} from './lib/crud_v2.js';

// Load our secrets file. All we have is prod - if we had a real dev server or db, we'd have separate secrets for that as well
const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const prod = loadJSON('./secrets/prod.json'); // All this contains as of now is our Database connection string; we'd add other API keys here as well later

// Initialize express app and configure w/ body-parser
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize the DB structure via our sequelize class
// Note that this effectively remakes the DB every time it runs, though it's non-destructive (i.e. only adds new fields)
const db = new Sequelize(prod.dbConnectionString);
const models = db.sequelize.models;

const aWresponses = {
    200: 'Webhook processed successfully',
    400: 'Invalid input',
    500: 'Server error'
}

app.post('/accept_webhook', async (req, res) => {
    /* 
    Assuming we don't really care about error reporting, we can use a catch-all here based on the responses above.
    
    This would be the first larger piece that I'd add when doing this later on.
    */
    let status = 500;

    // Initial check for the body & payload content
    if (!req.body || !req.body.payload_content) {
        status = 400;
    }

    const payload = req.body.payload_content;
    /* 
    First next step I'd take is somehow auto-validating via our Yaml schema, vs. manually checking the data.
    */
    switch(req.body?.payload_type) {
        case 'PersonAdded':
            if (payload?.person_id && payload?.name && payload?.timestamp) {
                let r = await createPerson(models, payload)
                if (r.success) {
                    status = 200;
                } else {
                    status = 500;
                }
            } else {
                status = 400;
            }
            break;
        case 'PersonRenamed':
            if (payload?.person_id && payload?.name && payload?.timestamp) {
                let r = await renamePerson(models, payload)
                if (r.success) {
                    status = 200;
                } else {
                    status = 500;
                }
            } else {
                status = 400;
            }
            break;
        case 'PersonRemoved':
            if (payload?.person_id && payload?.timestamp) {
                let r = await deletePerson(models, payload)
                if (r.success) {
                    status = 200;
                } else {
                    status = 500;
                }
            } else {
                status = 400;
            }
            break;
        default:
            status = 400;
    }

    let description = aWresponses[status];
    res.send({ status, description });
    return;
});

const gNResponses = {
    200: 'Name fetched successfully',
    400: 'Invalid UUID format',
    500: 'Server error'
}

app.get('/get_name', async (req, res) => {
    let status = 500;
    let name = null;

    // Initial check for the body & payload content
    if (!req.body || !req.body.payload_content) {
        status = 400;
    }

    const payload = req.body.payload_content;
    if (payload?.person_id) {
        let r = await getPersonName(models, payload)
        if (r.success) {
            status = 200;
            name = r.name;
        } else {
            status = 500;
        }
    } else {
        status = 400;
    }
    let description = gNResponses[status];
    res.send({ status, description, data: { name } });
});

// This call exists purely for the frontend to give me a list of all People in the database (so I can display it)
app.get('/get_all_people', async (req, res) => {
    let r = await getAllPeople(models)
    let status = 500;
    if (r.success) {
        status = 200;
    } else {
        status = 500;
    }
    res.send({ status, data: { people: r.people } });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* V2 ENDPOINTS - Same as the above but modified to preserve each entry (as "Action") vs. update a single item */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/v2/accept_webhook', async (req, res) => {
    /* 
    Assuming we don't really care about error reporting, we can use a catch-all here based on the responses above.
    
    This would be the first larger piece that I'd add when doing this later on.
    */
    let status = 500;
    const now = new Date().toISOString();

    // Initial check for the body & payload content
    if (!req.body || !req.body.payload_content) {
        status = 400;
    }

    let payload = req.body.payload_content;
    payload['timestamp'] = now; // We'll add the timestamp here to ensure it's always present and accurate (and that we don't have to iterate test data)
    
    /* 
    First next step I'd take is somehow auto-validating via our Yaml schema, vs. manually checking the data.
    */
    switch(req.body?.payload_type) {
        case 'PersonAdded':
            if (payload?.person_id && payload?.name && payload?.timestamp) {
                let r = await createPerson_v2(models, payload)
                if (r.success) {
                    status = 200;
                } else {
                    status = 500;
                }
            } else {
                status = 400;
            }
            break;
        case 'PersonRenamed':
            if (payload?.person_id && payload?.name && payload?.timestamp) {
                let r = await renamePerson_v2(models, payload)
                if (r.success) {
                    status = 200;
                } else {
                    status = 500;
                }
            } else {
                status = 400;
            }
            break;
        case 'PersonRemoved':
            if (payload?.person_id && payload?.timestamp) {
                let r = await deletePerson_v2(models, payload)
                if (r.success) {
                    status = 200;
                } else {
                    status = 500;
                }
            } else {
                status = 400;
            }
            break;
        default:
            status = 400;
    }

    let description = aWresponses[status];
    res.send({ status, description });
    return;
});

app.get('/v2/get_name', async (req, res) => {
    let status = 500;
    let name = null;

    // Initial check for the body & payload content
    if (!req.body || !req.body.payload_content) {
        status = 400;
    }

    const payload = req.body.payload_content;
    if (payload?.person_id) {
        let r = await getPersonName_v2(models, payload)
        if (r.success) {
            status = 200;
            name = r.name;
        } else {
            status = 500;
        }
    } else {
        status = 400;
    }
    let description = gNResponses[status];
    res.send({ status, description, data: { name } });
});

app.get('/v2/get_all_people', async (req, res) => {
    let r = await getAllPeople_v2(models)
    let status = 500;
    if (r.success) {
        status = 200;
    } else {
        status = 500;
    }
    res.send({ status, data: { actions: r.actions } });
});


const port = 3000; // I typically use 9000 since I often use GraphQL, but any will do here
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});