# Package Script

- [Package Script](#package-script)
- [Help](#help)
- [General Development](#general-development)
  - [Launch Packager](#launch-packager)
- [iOS Development](#ios-development)
  - [Development Environment](#development-environment)
  - [Staging Environment](#staging-environment)
  - [Production Environment](#production-environment)
- [Android Development](#android-development)
  - [Development Environment](#development-environment-1)
  - [Staging Environment](#staging-environment-1)
  - [Production Environment](#production-environment-1)
- [Test](#test)
- [Lint](#lint)
- [Format](#format)
- [Deploy](#deploy)
  - [Setup Current Project Configuration To "development"](#setup-current-project-configuration-to-development)
  - [Setup Current Project Configuration To "staging"](#setup-current-project-configuration-to-staging)
  - [Setup Current Project Configuration To "production"](#setup-current-project-configuration-to-production)
  - [iOS Deploy](#ios-deploy)
    - [Build, Bump Build Number, Upload To Test Flight](#build-bump-build-number-upload-to-test-flight)
    - [Build, Bump Patch Version Number, Upload To Test Flight](#build-bump-patch-version-number-upload-to-test-flight)
    - [Build, Bump Minor Version Number, Upload To Test Flight](#build-bump-minor-version-number-upload-to-test-flight)
    - [Build, Bump Major Version Number, Upload To Test Flight](#build-bump-major-version-number-upload-to-test-flight)
  - [Android Deploy](#android-deploy)
- [Clean Build Output](#clean-build-output)
  - [iOS](#ios)
  - [Android](#android)

# Help

Use this command to display this file.

```bash
yarn ?
```

# General Development

## Launch Packager

Run React Native packager for simulators to download the app from, and serve as a console for your mobile application. This script is only necessary for Android development as a temporary workaround for this problem here on Stack Overflow: [stackoverflow.com/questions/74187734/launchpackager-command-can-t-be-opened](https://stackoverflow.com/questions/74187734/launchpackager-command-can-t-be-opened). If you are devleloping on iOS, the packager should run automatically.

```bash
yarn packager
```

# iOS Development

The following scripts is used for running iOS in your development environemnt.

## Development Environment

Build iOS mobile application with development configuration and launch an iOS simulator.

```bash
yarn dev:ios <simulator-name>
# i.e yarn dev:ios "iPhone 14 Pro Max"
```

## Staging Environment

Build iOS mobile application with staging configuration and launch an iOS simulator.

```bash
yarn stage:ios <simulator-name>
# i.e yarn stage:ios "iPhone 14 Pro Max"
```

## Production Environment

Build iOS mobile application with production configuration and launch an iOS simulator.

```bash
yarn production:ios <simulator-name>
# i.e yarn production:ios "iPhone 14 Pro Max"
```

# Android Development

The following scripts is used for running Android in your development environemnt.

## Development Environment

Build Android mobile application with development configuration. Ensure you have start your packager.

```bash
yarn dev:android
```

## Staging Environment

Build Android mobile application with staging configuration. Ensure you have start your packager.

```bash
yarn stage:android
```

## Production Environment

Build Android mobile application with production configuration. Ensure you have start your packager.

```bash
yarn production:android
```

# Test

Scripts to run test, make sure all test case passes.

```bash
# Run test once
yarn test

# Run test in hot reload mode
yarn test:watch
```

# Lint

Check code for any errors. Ensure code follow style guidelines.

```bash
yarn lint
```

# Format

Format code to follow code style guidelines.

```bash
yarn format
```

# Deploy

The following scripts deploys your app to different environments.

## Setup Current Project Configuration To "development"

This command set the current project configuration to "development".

```bash
yarn setup:dev
```

## Setup Current Project Configuration To "staging"

This command set the current project configuration to "staging".

```bash
yarn setup:stage
```

## Setup Current Project Configuration To "production"

This command set the current project configuration to "production".

```bash
yarn setup:production
```

## iOS Deploy

### Build, Bump Build Number, Upload To Test Flight

This script builds iOS app using the current project's configuration and upload to Apple's iOS Test Flight as a newer build version (does not increment current app version, only increment build version of current app version).

```bash
yarn build:ios
```

### Build, Bump Patch Version Number, Upload To Test Flight

This script builds iOS app using the current project's configuration and upload to Apple's iOS Test Flight as a newer patch version (increments the last digit in the version. i.e 1.0.5 -> 1.0.6).

```bash
yarn patch:ios
```

### Build, Bump Minor Version Number, Upload To Test Flight

This script builds iOS app using the current project's configuration and upload to Apple's iOS Test Flight as a newer minor version (increments the middle digit in the version. i.e 1.0.5 -> 1.1.0).

```bash
yarn minor:ios
```

### Build, Bump Major Version Number, Upload To Test Flight

This script builds iOS app using the current project's configuration and upload to Apple's iOS Test Flight as a newer major version (increments the first digit in the version. i.e 1.1.0 -> 2.0.0).

```bash
yarn major:ios
```

## Android Deploy

This script builds Android app using the current project's configuration. Upload the `.aab` up located at `android/app/build/outputs/bundle/release/app-release.aab` to Goole Play.

# Clean Build Output

These scripts clean builds folder. Helps if you want to have a clean build from scratch without cached data.

## iOS

```bash
yarn clean:ios
```

## Android

```bash
yarn clean:android
```
