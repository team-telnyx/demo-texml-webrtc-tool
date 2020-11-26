const urljoin = require('url-join');
const axios = require('axios');
const baseTelnyxUrl = 'https://api.telnyx.com/v2/texml/calls/';
const baseTexmlUrl = urljoin(baseTelnyxUrl, process.env.TELNYX_CONNECTION_ID);
const authorizationString = 'Bearer ' + process.env.TELNYX_API_KEY;
const crypto = require('crypto');

module.exports.generateId = () => crypto.randomBytes(10).toString('hex');

module.exports.createTexmlCall = async data => {
  console.log('Creating Call');
  console.log(data);
  const config = {
    headers: {
      'Authorization': authorizationString
    },
    method: 'post',
    url: baseTexmlUrl,
    data
  }
  try {
    const result = await axios(config);
    console.log(`Created outbound call_session_id: ${result.headers['x-request-id']}`);
    return {
      ok: true,
      id: result.headers['x-request-id'],
      ...result.data
    };
  }
  catch (e) {
    console.log('Error creating call');
    console.log(e);
    return {
      ok: false,
      error: e
    };
  }
}

module.exports.gatherTeXML = gatherPrompt => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather action="gather" numDigits="1">
        <Say>${gatherPrompt}</Say>
    </Gather>
   <Say>We did not receive any input. Goodbye!</Say>
</Response>`;

module.exports.hangupTeXML = hangupSentence => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${hangupSentence}</Say>
  <Hangup/>
</Response>`;

module.exports.conferenceTeXML = (conferenceGreeting,conferenceId) => {

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${conferenceGreeting}</Say>
  <Dial>
    <Conference statusCallbackEvent="end" statusCallback="conference"> ${conferenceId}</Conference>
  </Dial>
</Response>`;
}

module.exports.errorTexml = errorText => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${errorText}</Say>
  <Hangup/>
</Response>`;

module.exports.transferTexml = (destination, greeting) => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${greeting}</Say>
  <Dial>${destination}</Dial>
  <Hangup/>
</Response>`;
