#!/bin/bash
TAG=$(date +%s)
docker build -t gcr.io/cloudcats-next/ccworker:$TAG .
docker push gcr.io/cloudcats-next/ccworker:$TAG
gcloud beta run deploy cloudcats-worker --region us-central1 --image gcr.io/cloudcats-next/ccworker:$TAG
