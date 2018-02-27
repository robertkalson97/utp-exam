from __future__ import print_function
import argparse
import boto3
import mimetypes
import os
import sys

from botocore.exceptions import ClientError


def upload_file_to_s3(bucket, artefact, bucket_key):
    """
    Uploads an artefact to Amazon S3
    """
    try:
        client = boto3.client('s3')

    except ClientError as err:
        print("Failed to create boto3 client.\n" + str(err))
        return False

    try:
        kwargs = {
            "Body": open(artefact, 'rb'),
            "Bucket": bucket,
            "Key": bucket_key
        }

        mime_type, encoding = mimetypes.guess_type(artefact)

        if mime_type is None:
            file_name, file_ext = os.path.splitext(artefact)

            if file_ext == ".icon" :
                kwargs["ContentType"] = "image/vnd.microsoft.icon"

            elif file_ext == ".woff2" :
                kwargs["ContentType"] = "application/font-woff"
            
        else:
            kwargs["ContentType"] = mime_type

        client.put_object(**kwargs)

    except ClientError as err:
        print("Failed to upload artefact to S3.\n" + str(err))
        return False

    except IOError as err:
        print("Failed to access artefact in this directory.\n" + str(err))
        return False

    return True


def upload_folder_to_s3(bucket, artefact, bucket_key=""):
  if os.path.isdir(artefact):
    src_path = artefact

    if src_path != "":
      src_path += "/"

    for root, subdirs, files in os.walk(artefact):
      for filename in files:
          file_path = os.path.join(root, filename)

          if bucket_key != "" and bucket_key[-1] == "/":
            bucket_key += "/"

          if not upload_file_to_s3(bucket, file_path, file_path.replace(src_path, bucket_key)):
              return False

    return True

  return upload_file_to_s3(bucket, artefact, bucket_key)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("bucket", help="Name of the existing S3 bucket")
    parser.add_argument("artefact", help="Name of the artefact to be uploaded to S3")
    parser.add_argument("bucket_key", nargs='?', default="", help="Name of the S3 Bucket key")
    args = parser.parse_args()

    if not upload_folder_to_s3(args.bucket, args.artefact, args.bucket_key):
        sys.exit(1)

if __name__ == "__main__":
    main()
