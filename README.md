# Draw for them

[![Test Backend](https://github.com/ncpleslie/draw-for-them/actions/workflows/test.yml/badge.svg)](https://github.com/ncpleslie/draw-for-them/actions/workflows/test.yml)
[![Test Results](https://camo.githubusercontent.com/6849be041b20ce8af9bee400d999597859f3f329f788e32ad13b93a8190e259c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f32352f32352d5041535345442d627269676874677265656e2e737667)](https://camo.githubusercontent.com/6849be041b20ce8af9bee400d999597859f3f329f788e32ad13b93a8190e259c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f32352f32352d5041535345442d627269676874677265656e2e737667)

![Image of the draw for you application](./documentation/draw_for_them_showcase.png)

[Live demo](https://drawforthem.nickleslie.dev)

Draw For Them is an ephemeral image sharing and drawing application that allows users to share their creations with other users. Built with NextJS, this application has real-time updates when users share images, add new friends, delete friends, update your profile, and view previous images sent to each other.

Head on over to https://drawforthem.nickleslie.dev to see it in action.

## Features

- [x] User Authentication through one-time code
- [x] NextJS and tRPC with WebSockets
- [x] Extensive testing of backend services
- [x] Drawing and viewing of images from other users
- [x] Expected social media features such as realtime interactions, friends, updating profile, etc.
- [x] Neumorphic design

## Development

### Tests

`pnpm tests`

Or through [Act](https://github.com/nektos/act) simply run `act`

### Dev

`pnpm dev`

### Build

`pnpm build`

## Deployment

Deployment steps are handled by [Railway](https://railway.app) but the testing pipeline is run through GitHub Actions. See [.github/workflows/test.yml](.github/workflows/test.yml)
