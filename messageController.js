const express  = require('express');
const router = module.exports = express.Router();
const telnyx = require('telnyx')(process.env.TELNYX_API_KEY);

const concatUrl = (b, e) => (new URL(e, b)).href

const messageController = async (req, res) =>  {
  const media = req.body.media_url;
  const messageRequest = {
    to: req.body.to,
    from: req.body.from,
    text: req.body.text,
    webhook_url: concatUrl(`${req.protocol}://${req.hostname}`, '/messaging/outbound')
  }
  if (media){
    messageRequest.media_urls = [media];
  }
  try{
    const messageResponse = await telnyx.messages.create(messageRequest);
    console.log(messageResponse);
    res.send(messageResponse);
  }
  catch (e) {
    console.log('error sending message');
    res.send(e);
  }
};

const inboundMessageController = (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
}

const outboundMessagingController = (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
}

router.route('/')
  .post(messageController)

router.route('/outbound')
  .post(outboundMessagingController)

router.route('/inbound')
  .post(inboundMessageController)