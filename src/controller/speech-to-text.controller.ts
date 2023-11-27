import { Request, Response } from 'express';
import log from '../utils/logger';
import * as fs from 'fs';

export const speechToTextController = (req: Request, res: Response) => {
  try {
    //
    // const pushStream = AudioInputStream.createPushStream();
    const speechKey = process.env.SPEECH_SUBSCRIPTION_KEY || '';
    const serviceRegion = process.env.SERVICE_REGION || '';
    console.log(speechKey);
    console.log(serviceRegion);
    if (!req.file) {
      log.info('[audioToText] No file from req.file');
      res.status(400).send({
        status: 'Error',
        data: { message: 'Did not receive any audio files' },
      });
    }
    console.log(req.file);
    // } else {
    //   fs.createReadStream(req?.file.filename)
    //     .on('data', (arrayBuffer: any) => {
    //       pushStream.write(arrayBuffer.slice());
    //     })
    //     .on('end', () => {
    //       pushStream.close();
    //     });

    //   console.log('Now recognizing from: ' + req.file.filename);

    //   const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
    //   const speechConfig = sdk.SpeechConfig.fromSubscription(
    //     speechKey,
    //     serviceRegion,
    //   );

    //   speechConfig.speechRecognitionLanguage = 'en-US';

    //   const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    //   let sentences = '';
    //   recognizer.recognizeOnceAsync(
    //     (result: any) => {
    //       console.log(result);

    //       recognizer.close();
    //     },
    //     (err) => {
    //       console.log('Error -' + err);
    //       recognizer.close();
    //     },
    //   );
    // }

    return res.status(200).send({ message: 'Success', data: {} });
  } catch (e: any) {
    return res.status(400).send(e.message);
  }
};
