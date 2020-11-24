
module.exports.gatherSentence = 'Please press 1 to accept the call';

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

module.exports.conferenceTeXML = conferenceGreeting => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${conferenceGreeting}</Say>
  <Dial>
    <Conference>Conf123</Conference>
  </Dial>
</Response>`;
