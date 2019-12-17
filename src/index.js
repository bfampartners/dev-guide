const symphony = require('symphony-api-client-node')
const http = require('http');
const express = require('express');
const app = express();
const healthRouter = require('./routes/health');
const bfamApi = require('./api/bfam');


const requestMap = {}

const onMessage = (event, messages) => {

    console.log("Received: " + JSON.stringify(event))

        if(typeof event !== 'undefined' && event.length > 0 && typeof event[0].data !== 'undefined') {
            var rfq = JSON.parse(event[0].data)

            if(typeof rfq.summary.rfqId !== 'undefined') {

                // Publish log to separate Symphony channel
                bfamApi.publish(rfq, 'kBNbHJ9J+Hf3lRhfHNELhn///pO3hUlsdA==');

                // Accepting
                if(typeof rfq.summary.structure !== 'undefined' ) {
                    symphony.sendMessage(event[0].stream.streamId, "Sending structure...", null, symphony.MESSAGEML_FORMAT)
                    bfamApi.structure(rfq);
                }
                else if(rfq.summary.confMsg !== null && rfq.summary.confMsg.length > 0) {
                    symphony.sendMessage(event[0].stream.streamId, "Accepting / Rejecting...", null, symphony.MESSAGEML_FORMAT)
                    if(requestMap[rfq.summary.rfqId]) {
                        bfamApi.reject(rfq);
                    }
                    else {
                        bfamApi.accept(rfq);
                    }
                }
                else {

                    requestMap[rfq.summary.rfqId] = rfq.summary.comment.indexOf("reject") != -1

                    let resp = "Received request for " + rfq.summary.rfqMessage + " with id " + rfq.summary.rfqId + " from " + rfq.summary.rfqSender
                    console.log(resp)
                    symphony.sendMessage(event[0].stream.streamId, resp, null, symphony.MESSAGEML_FORMAT)

                    setTimeout(() => {
                        symphony.sendMessage(event[0].stream.streamId, "Acking..", null, symphony.MESSAGEML_FORMAT)
                        bfamApi.acknowledge(rfq);
                    }, 2000);

                    setTimeout(() => {
                        symphony.sendMessage(event[0].stream.streamId, "Quoting...", null, symphony.MESSAGEML_FORMAT)
                        bfamApi.quote(rfq);
                    }, 4000);

                }
            }
        }
}

const onError = error => {
    console.error('Error reading data feed', error)
  }

symphony.initBot(__dirname + '/config.json').then((symAuth) => {
    console.log('Init bot...')
    symphony.getDatafeedEventsService({onMessage: onMessage, onError: onError}) 
    console.log('Bot started...')
})


server = http.createServer(app);
const port = 80
app.use('/health', healthRouter)
server.listen(port, () => console.log('Monitoring server running on port ' + port));
