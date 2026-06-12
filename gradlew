#!/bin/sh
GRADLE_USER_HOME="${GRADLE_USER_HOME:-$HOME/.gradle}"
GRADLE_VERSION="8.2"
GRADLE_ZIP="$GRADLE_USER_HOME/wrapper/dists/gradle-$GRADLE_VERSION-bin/gradle-$GRADLE_VERSION-bin.zip"
GRADLE_DIR="$GRADLE_USER_HOME/wrapper/dists/gradle-$GRADLE_VERSION-bin/gradle-$GRADLE_VERSION"

if [ ! -d "$GRADLE_DIR" ]; then
    mkdir -p "$GRADLE_USER_HOME/wrapper/dists/gradle-$GRADLE_VERSION-bin"
    curl -L -o "$GRADLE_ZIP" "https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip"
    unzip -q "$GRADLE_ZIP" -d "$GRADLE_USER_HOME/wrapper/dists/gradle-$GRADLE_VERSION-bin"
fi

exec "$GRADLE_DIR/bin/gradle" "$@"
