# Draw for them

A basic application where you can draw pictures for your friends.
Friends will be notified they have a new drawing and they can be viewed straight from the application.

The electron application has been built to run on the `Raspberry Pi Zero 2 W` with the `HyperPixel 4.0 Rectangle Touch-screen`.

## To build for release

This repo makes use of the [GitHub Action](https://github.com/samuelmeuli/action-electron-builder) produced by [Samuel Meuli](https://github.com/samuelmeuli).

### When you want to create a new release, follow these steps:

- Update the version in your project's package.json file (e.g. 1.2.3)
- Commit that change (git commit -am v1.2.3)
- Tag your commit (git tag v1.2.3). Make sure your tag name's format is v*.*.\*. Your workflow will use this tag to detect when to create a release
- Push your changes to GitHub (git push && git push --tags)
