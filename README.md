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
```

# CI/CD

On push to branch "dev", build and distribute ios apps to testflight

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
```
