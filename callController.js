const express  = require('express');
const router = module.exports = express.Router();
const texml = require('./texml');
const axios = require('axios');

/**
 *
 * @param b base Url
 * @param e Extension
 * @returns {string}
 */
const concatUrl = (b, e) => (new URL(e, b)).href


const createTexmlCall = async data => {
  const baseTelnyxUrl = 'https://api.telnyx.com/v2/texml/calls/';
  const config = {
    headers: {
      'Authorization': 'Bearer ' + process.env.TELNYX_API_KEY
    },
    method: 'post',
    url: concatUrl(baseTelnyxUrl, process.env.TELNYX_CONNECTION_ID),
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

const createPSTNCall = (To, From) => {
  const callRequest = {
    To,
    From,
    Url: concatUrl(process.env.BASE_URL, `texml/pstn-answer`)
  }
  const result = createTexmlCall(callRequest);
  return result;
}

const createWebRTCCall = (sipURI, From) => {
    const callRequest = {
    To:sipURI,
    From,
    Url: concatUrl(process.env.BASE_URL, `texml/webrtc-answser`)
  }
  const result = createTexmlCall(callRequest);
  return result;
}

const handleCallRequest = async (req, res) => {
  const pstnLegPromise = createPSTNCall(req.body.to, req.body.from);
  const webRTCLegPromise = createWebRTCCall(req.body.sipURI, req.body.from);
  try {
    const result = await Promise.all([webRTCLegPromise, pstnLegPromise]);
    res.status(201).send(result);
  }
  catch (e) {
   res.status(400).send(e);
  }
}

router.route('/')
  .post(handleCallRequest);
