# CLOUD CATS

CloudCats is an example of using node.js and various Google Cloud APIs and services to solve the greatest question of our time:  do developers prefer dogs or cats.  

![CATS IN THE CLOUD][screenshot]

__This is an adaptation of the [awwvision][awwvision], which uses [Kubernetes][kubernetes] to do something similar.  Credit to [Jon Parrot][jon] for the idea.__

## How it works

Cloud Cats queries for a list of images from the front page of [r/aww][raww].  Each of those images is saved into [Google Cloud Storage][storage], and then analyzed using the [Google Cloud Vision API][vision].  

![Architectural diagram][how-it-works]

Cloud Cats uses a few Google Cloud APIs and Services.  

- Users visit the front application, which is running in an [App Engine][appengine] module.  
- When you're ready to do a run, the {+} will call an endpoint on the [worker][/worker] module.
- The worker will invoke the [Reddit JSON API][reddit] to get a list of images from [r/aww][raww].
- Images are saved to [Google Cloud Storage][storage].
- The [Cloud Vision API][vision] analyzes the image, and tags it as dog or cat or other.
- The result is placed in a [Google Cloud Pub/Sub][pubsub] topic.
- The front end App Engine Module subscribes to results from the topic.
- Results are streamed to the user using [PubNub][pubnub].

## Setup

1. Create a project in the [Google Cloud Platform Console](https://console.cloud.google.com/).
1. [Enable billing](https://console.cloud.google.com/project/_/settings) for your project.
1. Enable Storage, PubSub, and Cloud Vision APIs in the API Manager.
1. Create a service account and save the JSON key file in 'web/keyfile.json' amd 'worker/keyfile.json' as described in [gcloud-node](https://github.com/GoogleCloudPlatform/gcloud-node).
1. Create a Google Cloud Storage bucket. 
1. Set 'GCLOUD_PROJECT' and 'GCLOUD_BUCKET' in 'web/package.json' and worker/package.json'.
1. Create a [PubNub](https://www.pubnub.com) project, note down publish and subscribe keys and update 'web/secrets.json'.

## Run it locally

1. Start frontend: In web folder, 'npm install' and then 'npm start'
1. Start backend: In worker folder, 'npm install' and then 'npm start'
1. Go to 'http://localhost:8080' and hit plus to start.

## Deployment

This code is built as a demo for running [Node.js on Google Cloud](https://cloud.google.com/nodejs), but you can run it anywhere that node.js works.  

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).
1. Deploy with `gcloud preview app deploy web/app.yaml worker/app.yaml --project <YOUR PROJECT>`


## License
[MIT License](LICENSE.md)

## Questions?
Feel free to submit an issue on the repository, or find me at [@JustinBeckwith](http://twitter.com/JustinBeckwith)

[awwvision]: https://github.com/GoogleCloudPlatform/cloud-vision/tree/master/python/awwvision
[kubernetes]: http://kubernetes.io/
[jon]: https://github.com/jonparrott
[screenshot]: http://i.imgur.com/lzR8TDn.jpg
[how-it-works]: http://i.imgur.com/46Ilm2D.png
[appengine]: https://cloud.google.com/appengine/
[raww]: https://www.reddit.com/r/aww
[storage]: https://cloud.google.com/storage/
[vision]: https://cloud.google.com/vision/
[reddit]: https://github.com/reddit/reddit/wiki/JSON
[pubsub]: https://cloud.google.com/pubsub/
[pubnub]: https://www.pubnub.com/

