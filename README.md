### Claim Conductor Model/Demo

Welcome to the repo! First a quick rundown of the structure here:
- The main file to run is in ```server.js```. This serves as the primary head-in for the service. Note 

## Deployment

The service is deployed as a basic **express.js server**, running in **AWS EC2** via **PM2** with data hosted in **AWS RDS** via an instance of **MariaDB**. I chose this infrastructure because it's very quick to standup and offers a lot of scalability up to fairly large volumes, plus AWS autoscaling ensures you're less likely to hit availability walls.

## Useful Links



Server for claim conductor API can be found running at: http://54.193.231.155:3000/. Note that nothing is actually being returned to the frontend here - this serves exclusively to serve data via HTTP requests.

Please note that:
- This is running in a public nano ec2 instance; caps on memory will be very low.
- This has not been configured to run over HTTPS and thus must be run unsecurely over HTTP. Check your browser settings if the page does not load, though it should load fine so long as the url specifies http:// vs https://.

Happy assessing! Will add notes here as they become relevant.

