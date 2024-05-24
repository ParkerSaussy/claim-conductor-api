### Claim Conductor Model/Demo

Welcome to the repo! First a quick rundown of the structure here:
- The main file to run is in ```server.js```. This serves as the primary head-in for the service.
- ```lib/``` contains util functions for the api calls as well as the Sequelize instance used for the DB.
- The original YAML file is included as well, though this was only so that I could use it for reference.

## Deployment & Writeup

The service is deployed as a basic **express.js server**, running in **AWS EC2** via **PM2** with data hosted in **AWS RDS** via an instance of **MariaDB**. I chose this infrastructure because it's very quick to standup and offers a lot of scalability up to fairly large volumes, plus AWS autoscaling ensures you're less likely to hit availability walls in the event of traffic spikes. MariaDB (or really any SQL DB for that matter) is, to me, better suited for scalability with data of this simplicity than, say, MongoDB, because indexing allows you to pull results much quicker at scale. 

The primary thing this is missing IMO is detailed error handling. In any CRUD app, we'd ideally like to have detailed error reporting (i.e. "user already exists", etc.) and that's missing here in favor of quick catch-alls. It's not the most critical to implement, but it helps for user comprehension.

The base functions are implemented as async/await calls vs. Promises. This is primarily so that I could avoid needing to manage either A) a mix of asynchronous and synchronous values in the return function, or B) needing to return content from every potential output. Rather, we allow there to be single variables tracking status and description, and any other content is returned as a part of the same object.

This infrastructure, when paired w/ a reverse proxy like nginx, can also provide us with horizontal scaling capability in the case of distributed services. We can also use AWS Cloudfront distributions for this, but that's another story.

UPDATE #1: Though I reached time earlier on and moved onto the frontend, I realized afterwards that the prompt actually intended for me to hold onto each actual change action and add new ones each time a rename occurred, and thus return the newest one when get_name is called. I missed this on my read-thru, so it's not  implemented here. It's a simple change but since I'm past time, I'll speak to how I'd modify this to address that when we next speak.

UPDATE #2: Since it was low-lift, I made a slightly modified version of the API which uses the **Actions** table instead of Person, and which preserves the creation and renaming objects for each user (to address the misunderstanding I mentioned in Update #1). As such, ```get_user``` now returns the most recent rename action made to that Person (though, again, People are contextualized as "Actions" now). Removing a user will still drop these rows. The modified versions of these apis can be found at the same deployed URL, but under **/v2/accept_webhooks** and **/v2/get_name** respectively. 

I'm happy to share login info for the server or database if you'd like to SSH into either.

To run this locally, simply clone the repo, then from the root directory:
1. Run ```npm i``` 
2. Copy/Paste the unzipped secrets folder into the root directory
3. Run ```node server```

You should see the service running at http://localhost:3000.

### Useful Links

See below for links relevant to the project:
- Running API: http://54.193.231.155:3000/
  - Note that nothing is actually being returned to the frontend here - this serves exclusively to serve data via HTTP requests.
  - This has not been configured to run over HTTPS and thus must be run unsecurely over HTTP. Check your browser settings if the page does not load, though it should load fine so long as the url specifies http:// vs https://.
  - This is running in a public nano ec2 instance; caps on memory will be very low. Shouldn't be any RAM issues.
- MariaDB instance: claim-conductor-db.cls8i8caeju7.us-west-1.rds.amazonaws.com
  - See my email for login info here if you're interested in logging in. Port will always be 3306

Happy assessing! Will add notes here as they become relevant.
