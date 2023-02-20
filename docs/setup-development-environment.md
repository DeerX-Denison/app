# Setup Development Environment

# Table Of Contents

- [Setup Development Environment](#setup-development-environment)
- [Table Of Contents](#table-of-contents)
- [Clone Repository](#clone-repository)
- [Install homebrew](#install-homebrew)
- [Install ruby](#install-ruby)
- [Install cocoapods](#install-cocoapods)
- [Install nvm](#install-nvm)
- [Install yarn](#install-yarn)
- [Install Project Dependencies](#install-project-dependencies)
- [Setup Android Development](#setup-android-development)
	- [Download Android Studio](#download-android-studio)
	- [Setup Shell Environment Variables](#setup-shell-environment-variables)
	- [Launch Packager](#launch-packager)
	- [Launch App On Android Simulator](#launch-app-on-android-simulator)
- [Setup iOS Development](#setup-ios-development)
	- [Install Extra Pod Packages](#install-extra-pod-packages)
	- [Launch App On iOS Simulator](#launch-app-on-ios-simulator)
- [Happy Coding](#happy-coding)

# Clone Repository

```bash
git clone https://github.com/DeerX-Denison/app
```

# Install homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

# Install ruby

```bash
brew install ruby
```

# Install cocoapods

```bash
brew install cocoapods
```

# Install nvm

```bash
# Run the following command to download nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Close and reopen your terminal

# Confirm installation
nvm -v
```

# Install yarn

```
npm install —location=global yarn
```

# Install Project Dependencies

```
yarn install
```

# Setup Android Development

## Download Android Studio

Follow the official documentation on how to install Android Studio: [developer.android.com/studio](https://developer.android.com/studio). The default standard instllation works fine if you haven't already installed Android Studio since it contains the following extra package:

- Android Emulator
- Android SDK Build-Tools
- Android SDK Platform
- Android SDK Platform-Tools

Accept the terms and condition after you have read all of it, then press finish to install all the extra packages. You still need to create a device in Android Emulator.

Choose “More Actions” > “Virtual Device Manager” to create a virtual device of your liking. Press any phone. If this is your first time with Android Studio, it will ask you to install a system image. As far as i know, any common image will work. Read and accept the terms and condition and install the system image.

Once installed, start the virtual device from the Device Manager window. You can get here by looking for the “Virtual Device Manager” button.

## Setup Shell Environment Variables

If you don't know which Shell are you using, you can run this command to check:

```bash
echo $0
```

Add the following to your shell profile. Assuming you are using `bash`, then your Shell profile could be `~/.bashrc` or `~/bash_profile`.

```bash
export ANDROID_SDK_ROOT=~/Library/Android/sdk
export ANDROID_HOME=~/Library/Android/sdk
```

## Launch Packager

In a separate terminal, run:

```bash
yarn packager:android
```

## Launch App On Android Simulator

In the original terminal

```bash
yarn stage:android
```

[Happy coding!](#happy-coding)

# Setup iOS Development

## Install Extra Pod Packages

```bash
cd ios
bundle install
pod install
```

## Launch App On iOS Simulator

Assuming you have setup your XCode with your provisioning profile correctly, you can start the simulator and begin coding with a simple command:

```bash
yarn stage:ios
```

[Happy coding!](#happy-coding)

# Happy Coding

Refer to our [code guidelines](code-guidelines.md) to ensure that your code matches our coding guidelines.
