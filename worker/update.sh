#!/bin/bash
gcloud builds submit --tag gcr.io/cloudcats-next/ccworker --project cloudcats-next
gcloud beta run deploy cloudcats-worker --project cloudcats-next --image gcr.io/cloudcats-next/ccworker:latest --platform managed --region us-central1
