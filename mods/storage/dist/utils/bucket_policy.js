"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Bucket policy - GET requests on "storageBucket" while skiping authentication.
function default_1(bucket) {
    return `
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": [
            "s3:GetBucketLocation",
            "s3:ListBucket"
          ],
          "Effect": "Allow",
          "Principal": {
            "AWS": [
              "*"
            ]
          },
          "Resource": [
            "arn:aws:s3:::${bucket}"
          ],
          "Sid": ""
        },
        {
          "Action": [
            "s3:GetObject"
          ],
          "Effect": "Allow",
          "Principal": {
            "AWS": [
              "*"
            ]
          },
          "Resource": [
            "arn:aws:s3:::${bucket}/*"
          ],
          "Sid": ""
        }
      ]
    }
  `;
}
exports.default = default_1;
