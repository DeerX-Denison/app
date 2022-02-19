# DeerX Application

# Package Script

```
# If you are using M1 Macbooks for development, make sure to prepend the below code for every package scripts. This will run script under rosetta simulation
arch -x86_64 [package_script]

# Run development ios (conenct to emulators backend)
yarn dev:ios

# Run staging ios (connect to staging cloud backend)
yarn stage:ios

# Run production ios (connect to production cloud backend)
yarn prod:ios

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

# CI/CD

On push to branch "staging", build and distribute ios apps to testflight

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
