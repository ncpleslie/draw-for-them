import * as functions from "firebase-functions";
import { HTTPMethod } from "./enums/http.enum";
// import { exec } from "child_process";
import fs from "fs";
import path from "path";
// import { file2 } from "./test_images/test";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const image_test = functions.https.onRequest(
  (request: functions.Request, response: functions.Response) => {
    if (request.method !== HTTPMethod.GET) {
      response.status(404);

      return;
    }

    const image = fs.readFileSync(
      path.join(__dirname, "./test_images/testfile"),
      "utf8"
    );

    response.status(200).send(image.replace(/ /gi, "").toString());
  }
);

export const image = functions.https.onRequest(
  (request: functions.Request, response: functions.Response) => {
    if (request.method !== HTTPMethod.GET) {
      response.status(404);

      return;
    }

    try {
      // const image = fs.readFileSync(
      //   path.join(__dirname, "./test_images/testfile"),
      //   "utf8"
      // );

      // response.status(200).send(image.replace(/ /gi, "").toString());

      const imageBuffer = fs.readFileSync(
        path.join(__dirname, "./test_images/test.jpg")
      );

      const imageHexString = imageBuffer.toString("hex");

      let cTypeHex = "\n";

      let groupCount = 0;
      for (let i = 0; i < imageHexString.length; i += 2) {
        cTypeHex += `0x${imageHexString[i]}${imageHexString[i + 1]}, `;
        groupCount++;
        if (groupCount % 12 === 0) {
          cTypeHex += "\n";
        }
      }

      response
        .status(200)
        .send(cTypeHex.slice(0, -2).replace(/ /gi, "").toString());

      return;

      // xxd -i test.jpg | sed "1s/.*//" | sed "s/ [a-zA-Z_]*l//"
      // exec(
      //   `xxd -i ${path.join(
      //     __dirname,
      //     "./test_images/test.jpg"
      //   )} | sed "1s/.*//" | sed "s/ [a-zA-Z_]*l//"`,
      //   (err, stdout, stderr) => {
      //     if (err) {
      //       functions.logger.log("Unable to open file", err);
      //       response.status(500);

      //       return;
      //     }

      //     if (stderr) {
      //       functions.logger.log("Unable to open file", stderr);
      //       response.status(500);

      //       return;
      //     }

      //     if (!stdout) {
      //       functions.logger.log("Unable to read file");
      //       response.status(500);

      //       return;
      //     }

      //     const fileDataAsHex = stdout.split("}")[0].replace(/ /gi, "");
      //     response.status(200).send(fileDataAsHex.toString());

      //     return;
      //   }
      // );
    } catch (e) {
      functions.logger.log("Unable to open file", e);
      response.status(500);
      return;
    }

    response.status(500);
  }
);
