## Setup

### FCM 
1. Set up Account in FCM
2. Download the JSON file
3. Add the path of JSON file to env variable ```$GOOGLE_APPLICATION_CREDENTIALS```
4. for more help [follow here](https://firebase.google.com/docs/admin/setup).

### Google Auth 
1. Set up google Auth
2. Add credentials to ```constants/config.js``` file

### Meilisearch
1. Set up meilesearch. For instructions [follow here](https://www.meilisearch.com/docs/learn/getting_started/installation).
2. Add meilesearch server URL as ```SEARCH_ENGINE``` to ```constants/config.js``` file

### RazorPay
1. Setup RazorPay Test account [follow here](https://razorpay.com/docs/x/sign-up/).
2. Add credentials to ```constants/config.js``` file

### MongoDB
1. Setup MongoDB
2. Atlas is recommended. If you are using local setup make sure to add support for [Replica Set](https://www.mongodb.com/docs/manual/replication/).
2. Add MongoDB URL as ```MONGO_URL``` to ```constants/config.js``` file

### File Server
1. Setup file server. [follow here](https://github.com/goffygoo/project-x-file-server/blob/main/README.md).
2. Add file server URL as ```FILE_SERVER``` to ```constants/config.js``` file


## Steps to start
1. ```npm i```
2. ```node createPagesIndex.js```
3. ```npm start```



## Other affiliated repos
* [mobile-client](https://github.com/goffygoo/vitrine-client-mobile)
* [client-web](https://github.com/redscool/vitrine-client-web)
* [file-server](https://github.com/goffygoo/vitrine-file-server)



