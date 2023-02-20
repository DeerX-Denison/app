# Setup Development Environment

Current system: Apple M1

Git version 2.37.1

Xcode 14.2

Clone repo:

```
Git clone https://github.com/DeerX-Denison/app
```

Install Homebrew if you haven’t already:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install Curl if you haven’t already:
https://curl.se/download.html
Download the latest version of Curl that ends in .tar.gz file
Unzip the folder.
Move the folder to your preferred location, make a note of it cause you will need it.

```
# Cd to where the unzip folder is
make
make install
# Close and reopen terminal
# Confirm installation
curl —version
```

Install Ruby

```
brew install ruby
```

Install Cocoapods

```
brew install cocoapods
```

Install nvm

```
curl -o- ` | bash
# Close and reopen your terminal
# Confirm installation
nvm -v
```

Install yarn

```
npm install —location=global yarn
```

Install all project dependencies

```
yarn install
```

For Android development

Download Android Studio
https://developer.android.com/studio
Open the .dmg file and drag Android Studio into Application folder
Press “Do not import settings”, if you haven’t already have your own settings.
Choose standard installation
The verification screen should have these following. The numbers and versions might be different. As long as there is all the standard type, you’re good to go.

```
Setup Type: Standard
SDK Folder: /Users/test/Library/Android/sdk
JDK Location: /Applications/Android Studio.app/Contents/jbr/Contents/Home
Total Download Size: 386 MB
SDK Components to Download:

Android Emulator
  
253 MB

Android SDK Build-Tools 33.0.2
  
57.2 MB

Android SDK Platform 33
  
64.4 MB

Android SDK Platform-Tools
  
10.7 MB
```

Accept the terms and condition after you have read all of it, then press finish to install all the extra packages.

Choose “More Actions” > “Virtual Device Manager” to create a virtual device of your liking. Press any phone. If this is your first time with Android Studio, it will ask you to install a system image. As far as i know, any common image will work. Read and accept the terms and condition and install the system image.

￼

Once installed, start the virtual device from the Device Manager window. You can get here by looking for the “Virtual Device Manager” button.

Add the following to your shell profile. We need this 2 environment variables.
export ANDROID_SDK_ROOT=~/Library/Android/sdk  
export ANDROID_HOME=~/Library/Android/sdk

In a separate terminal, run:

```
yarn packager:android
```

In the original terminal

```
yarn stage:android
```

For iOS development
Install extra packages

```
cd ios
bundle install
pod install
```

Setup iOS provisioning profile

Run iOS app

```
yarn stage:ios
```
