#!/bin/bash
TAG=$(date +%s)
docker build -t gcr.io/cloudcats-next/ccweb:$TAG .
docker push gcr.io/cloudcats-next/ccweb:$TAG
gcloud beta run deploy cloudcats-web --project cloudcats-next --image gcr.io/cloudcats-next/ccweb:$TAG
