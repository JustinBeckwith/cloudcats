# CLOUD CATS

[![CircleCI badge](https://circleci.com/gh/JustinBeckwith/cloudcats/tree/master.svg?style=shield)](https://circleci.com/gh/JustinBeckwith/cloudcats/tree/master)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![Known Vulnerabilities](https://snyk.io/test/github/justinbeckwith/cloudcats/badge.svg)](https://snyk.io/test/github/justinbeckwith/cloudcats)

CloudCats is an example of using node.js and various Google Cloud APIs and services to solve the greatest question of our time:  do developers prefer dogs or cats.

![CATS IN THE CLOUD][screenshot]

__This is an adaptation of the [awwvision][awwvision], which uses [Kubernetes][kubernetes] to do something similar.  Credit to [Thea Flowers][thea] for the idea.__

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


## Deployment

This code is built as a demo for running [Node.js on Google Cloud](https://cloud.google.com/nodejs), but you can run it anywhere that node.js works.

1. Create a project in the [Google Cloud Platform Console](https://console.cloud.google.com/).
1. [Enable billing](https://console.cloud.google.com/project/_/settings) for your project.
1. Enable Storage, PubSub, and Cloud Vision APIs in the API Manager.
1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/).
1. Deploy with `gcloud preview app deploy web/app.yaml worker/app.yaml --project <YOUR PROJECT>`


## License
[MIT License](LICENSE.md)

## Questions?
Feel free to submit an issue on the repository, or find me at [@JustinBeckwith](http://twitter.com/JustinBeckwith)

[awwvision]: https://github.com/GoogleCloudPlatform/cloud-vision/tree/master/python/awwvision
[kubernetes]: http://kubernetes.io/
[thea]: https://github.com/theacodes
[screenshot]: http://i.imgur.com/lzR8TDn.jpg
[how-it-works]: http://i.imgur.com/46Ilm2D.png
[appengine]: https://cloud.google.com/appengine/
[raww]: https://www.reddit.com/r/aww
[storage]: https://cloud.google.com/storage/
[vision]: https://cloud.google.com/vision/
[reddit]: https://github.com/reddit/reddit/wiki/JSON
[pubsub]: https://cloud.google.com/pubsub/
[pubnub]: https://www.pubnub.com/

