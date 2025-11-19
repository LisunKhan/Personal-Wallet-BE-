import boto3
from django.conf import settings

def get_s3_client():
    """
    Returns a boto3 S3 client configured with the project's settings.
    """
    return boto3.client(
        's3',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        endpoint_url=settings.AWS_S3_ENDPOINT_URL,
        region_name=settings.AWS_S3_REGION_NAME
    )

def upload_to_s3(file_obj, object_name):
    """
    Uploads a file to an S3 bucket.
    """
    s3_client = get_s3_client()
    s3_client.upload_fileobj(file_obj, settings.AWS_STORAGE_BUCKET_NAME, object_name)
    return object_name

def download_from_s3(object_name):
    """
    Downloads a file from an S3 bucket.
    """
    s3_client = get_s3_client()
    response = s3_client.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=object_name)
    return response['Body']

def delete_from_s3(object_name):
    """
    Deletes a file from an S3 bucket.
    """
    s3_client = get_s3_client()
    s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=object_name)
