Dashup Module Shop
&middot;
[![Latest Github release](https://img.shields.io/github/release/dashup/module-shop.svg)](https://github.com/dashup/module-shop/releases/latest)
=====

A connect interface for shop on [dashup](https://dashup.io).

## Contents
* [Get Started](#get-started)
* [Connect interface](#connect)

## Get Started

This shop connector adds shops functionality to Dashup shops:

```json
{
  "url" : "https://dashup.io", 
  "key" : "[dashup module key here]"
}
```

To start the connection to dashup:

`npm run start`

## Deployment

1. `docker build -t dashup/module-shop .`
2. `docker run -d -v /path/to/.dashup.json:/usr/src/module/.dashup.json dashup/module-shop`