const express  = require('express');
const telnyx = require('telnyx')(process.env.TELNYX_API_KEY);
const router = module.exports = express.Router();
const texml = require('./texml');

const toBase64 = data => (new Buffer.from(data)).toString('base64');
const fromBase64 = data => (new Buffer.from(data, 'base64')).toString();
const hangupSentence = 'Thank you for the call, hanging up';
const conferenceGreeting = 'Thank you for accepting the call, connecting you now';

const pstnAnswerController = (req, res) => {
  console.log(req.body);
  const gatherTeXML = texml.gatherTeXML(req.gatherSentence);
  res.type("application/xml").send(gatherTeXML);
}

const webRtcAnswerController = (req, res) => {
  console.log(req.body);
  res.type("application/xml").send(texml.conferenceTeXML(conferenceGreeting));
}

const gatherController = (req, res) => {
  console.log(req.body);
  const event = req.body;
  const digits = parseInt( event.Digits);
  const hangupTeXML = texml.hangupTeXML(hangupSentence);
  const conferenceTeXML = texml.conferenceTeXML(conferenceGreeting);
  const TeXML = (digits === 1) ? conferenceTeXML : hangupTeXML;
  res.type("application/xml").send(TeXML);
}

router.route('/gather')
  .post(gatherController)

router.route('/pstn-answer')
    .post(pstnAnswerController)

router.route('/webrtc-answser')
  .post(webRtcAnswerController)

router.route('/inbound')
  .post(pstnAnswerController)
