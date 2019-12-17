const symphony = require('symphony-api-client-node')
const https = require('https');
const api = {};

const postData = (path, content) => {

    var post_options = {
        host: "symphony-uat.bfam-partners.com",
        port: '443',
        path: path,
        method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(content),
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
        "rejectUnauthorized": false
    };
    var post_req = https.request(post_options, function(resp) {
        let data = '';

        // No need to validate until full request received
        resp.on('data', function (chunk) {
            data += chunk;
        });

        resp.on('end', () => {
            console.log('Response from host ' + data); 
        });

    });  
    post_req.write(content);
    post_req.end();    
}

const getStreamIdByConversationId = (conversationId) => {
    return conversationId.replace(new RegExp("/", 'g'), "_").replace(new RegExp("=", 'g'), "").replace(new RegExp("\\+", 'g'), "-")
}

api.acknowledge = (rfq) => {
    var ackContent = "bid=&ask=&delta=&ref=&rfqId=" + rfq.summary.rfqId + "&blastId=" + rfq.summary.blastId + "&confMsg=&quoteEmail=rfq-pricer%40bfam-partners.com&quoteDisplayName=RFQ+Pricer&quoteUserName=rfq-pricer%40brokerx.com&acknowledged=false&accepted=false&rejected=false&message=&altSize=&timer=26m+34s&active=true&superseded=false&wsConnected=true&wsFailed=false&status=&withdrawing=false&submitting=false&accepting=false&rejecting=false"
    postData('/api/ack', ackContent);
}

api.quote = (rfq) => {
    var quoteContent = "bid=14&ask=15&delta=&ref=&rfqId=" + rfq.summary.rfqId + "&blastId=" + rfq.summary.blastId + "&confMsg=&quoteEmail=rfq-pricer%40bfam-partners.com&quoteDisplayName=RFQ+Pricer&quoteUserName=rfq-pricer%40brokerx.com&acknowledged=true&accepted=false&rejected=false&message=&altSize=&timer=26m+44s&active=true&superseded=false&wsConnected=true&wsFailed=false&status=Johan+Lundin+(JLundin%40bfam-partners.com)+acknowledged+RFQ+NKY+3M+21000+CALL(%2B1C)++x+1%2C000+Listed.+Please+send+quote+when+ready.&withdrawing=false&submitting=false&accepting=false&rejecting=false"
    postData('/api/submit', quoteContent);
}

api.withdraw = (rfq) => {
    var quoteContent = "bid=0&ask=0&delta=&ref=&rfqId=" + rfq.summary.rfqId + "&blastId=" + rfq.summary.blastId + "&confMsg=&quoteEmail=rfq-pricer%40bfam-partners.com&quoteDisplayName=RFQ+Pricer&quoteUserName=rfq-pricer%40brokerx.com&acknowledged=true&accepted=false&rejected=false&message=&altSize=&timer=26m+44s&active=true&superseded=false&wsConnected=true&wsFailed=false&status=Johan+Lundin+(JLundin%40bfam-partners.com)+acknowledged+RFQ+NKY+3M+21000+CALL(%2B1C)++x+1%2C000+Listed.+Please+send+quote+when+ready.&withdrawing=false&submitting=false&accepting=false&rejecting=false"
    postData('/api/submit', quoteContent);
}

api.accept = (rfq) => {
    let acceptContent = "bid=14&ask=15&delta=&ref=&rfqId=" + rfq.summary.rfqId + "&blastId=" + rfq.summary.blastId + "&confMsg=BFAM+to+SELL+%40+14+size+1%2C000&quoteEmail=rfq-pricer%40bfam-partners.com&quoteDisplayName=RFQ+Pricer&quoteUserName=rfq-pricer%40brokerx.com&acknowledged=true&accepted=false&rejected=false&message=&altSize=&timer=8m+26s&active=true&superseded=false&wsConnected=true&wsFailed=false&status=Received+quote+14.0%2F15.0+for+RFQ+NKY+3M+21000+CALL(%2B1C)++x+1%2C000+Listed+from+Johan+Lundin+(JLundin%40bfam-partners.com)&withdrawing=false&submitting=false&accepting=false&rejecting=false"
    postData('/api/accept', acceptContent);
}

api.reject = (rfq) => {
    let rejectContent = "bid=14&ask=15&delta=&ref=&rfqId=" + rfq.summary.rfqId + "&blastId=" + rfq.summary.blastId + "&confMsg=BFAM+to+SELL+%40+14+size+1%2C000&quoteEmail=jlundin%40bfam-partners.com&quoteDisplayName=Johan+Lundin&quoteUserName=jlundin%40bfam-partners.com&acknowledged=true&accepted=false&rejected=false&message=&altSize=&timer=1m+13s&active=true&superseded=false&wsConnected=true&wsFailed=false&status=Johan+Lundin+(jlundin%40bfam-partners.com)+rejected+confirmation+for+BFAM+to+SELL+%40+14+size+1%2C000&withdrawing=false&submitting=false&accepting=false&rejecting=false"
    postData('/api/reject', rejectContent);
}

api.structure = (rfq) => {
    // Note that this is a sample for a two legged structure
    let structureContent = "bid=&ask=&delta=&ref=&quoteId=0414d275-416e-4138-800a-8cf38eeb9c39&rfqId=776817ed-02a9-40d8-8ad6-571fc43df1c6&price=14.0&size=1000.0&blastId=c448da57-660a-402a-b5bf-44f380ae872c&confMsg=undefined&quoteEmail=jlundin%40bfam-partners.com&quoteDisplayName=Johan+Lundin&quoteUserName=jlundin%40bfam-partners.com&accepted=false&rejected=false&message=&structure%5Bhedge%5D=true&structure%5Blegs%5D%5B0%5D%5Bdate%5D=3M&structure%5Blegs%5D%5B0%5D%5Bstrike%5D=23125&structure%5Blegs%5D%5B0%5D%5Btype%5D=P&structure%5Blegs%5D%5B0%5D%5Bratio%5D=1&structure%5Blegs%5D%5B0%5D%5Bprice%5D=6&structure%5Blegs%5D%5B1%5D%5Bdate%5D=3M&structure%5Blegs%5D%5B1%5D%5Bstrike%5D=23125&structure%5Blegs%5D%5B1%5D%5Btype%5D=C&structure%5Blegs%5D%5B1%5D%5Bratio%5D=1&structure%5Blegs%5D%5B1%5D%5Bprice%5D=8&altSize=&timer=Active&active=true&superseded=false&wsConnected=true&wsFailed=false&status=RFQ+Pricer+(rfq-pricer%40bfam-partners.com)+accepted+confirmation+for+BFAM+to+SELL+%40+14+size+1%2C000&calcPrice=14&submitting=false"
    postData('/api/structure', structureContent);
}

api.publish = (rfq, conversationId) => {
    try {
        var tbl = "<table>"
        Object.keys(rfq.summary).forEach(function(key, index) {
            tbl += "<tr><td>" + key + "</td><td>" + JSON.stringify(this[key]) + "</td></tr>"
          }, rfq.summary);
        tbl += "</table>"
        symphony.sendMessage(getStreamIdByConversationId(conversationId), tbl , null, symphony.MESSAGEML_FORMAT)
    }
    catch(e) {
        console.log(JSON.stringify(e))
    }
}

module.exports = api;