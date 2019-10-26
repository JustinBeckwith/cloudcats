#!/bin/bash
gcloud builds submit --tag gcr.io/cloudcats-next/ccweb --project cloudcats-next
gcloud beta run deploy cloudcats-web --project cloudcats-next --image gcr.io/cloudcats-next/ccweb:latest --platform managed --region us-central1
