# DeerX Application

# Package Script

```
# If you are using M1 Macbooks for development, make sure to prepend the below code for every package scripts. This will run script under rosetta simulation
arch -x86_64 [package_script]

# Run development ios (conenct to emulators backend)
yarn dev:ios:ip12
yarn dev:ios:ipSE

# Run staging ios (connect to staging cloud backend)
yarn stage:ios:ip12
yarn stage:ios:ipSE

# Run production ios (connect to production cloud backend)
yarn prod:ios:ip12
yarn prod:ios:ipSE

# Run test once
yarn test

# Run test continually
yarn test:watch

# Lint code
yarn lint

# Format code
yarn format

# Build staging app and distribute to test flight
yarn build:ios

# Build staging app and bump patch version, then distribute to test flight

# Build staging app and bump minor version, then distribute to test flight
yarn minor:ios

# Build staging app and bump major version, then distribute to test flight
yarn major:ios

# Build production app and distribute to app store
yarn release:ios
```

# Setup Environment Variables

fastlane environemnt variables:

- navigate to ios/fastlane/example.env
- fill out environment variables given by admin
- IMPORTANT: rename "example.env" to ".env" before commiting - git only ignores ".env" file, not "example.env"

# Get Started

```
# This project requries homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install ruby
brew install ruby

# Install cocoapds
brew install cocoapods

# Install React Native dependencies, Ruby depencies, compile native dependencies.
yarn install

# Run development suites
yarn dev:ios
```

# Deployments

```
# Setup app to connect to appropriate environment
yarn setup:dev
yarn setup:stage
yarn setup:prod

# Build app and upload with approperiate version
yarn build:ios // increment current build number
yarn patch:ios // increment patching version number
yarn minor:ios // increment minor version number
yarn major:ios // increment major version number
```

# Common Error

1. Could not connect to backend
   - It could by that backend is not running in the correctly environment. Try

```
firebase use default
```