#!/usr/bin/env bash

# Exit script if command fails or uninitialized variables used
set -euo pipefail

# ==================================
# Verify repo is clean
# ==================================

# List uncommitted changes and
# check if the output is not empty
if [ -n "$(git status --porcelain)" ]; then
  printf "\nError: repo has uncommitted changes\n\n"
  exit 1
fi

# ==================================
# Get latest version from git tags
# ==================================

# List git tags sorted lexicographically
# so version numbers sorted correctly
GIT_TAGS=$(git tag --sort=version:refname)

# Get last line of output which returns the
# last tag (most recent version)
GIT_TAG_LATEST=$(echo "$GIT_TAGS" | tail -n 1)

# If no tag found, default to v0.0.0
if [ -z "$GIT_TAG_LATEST" ]; then
  GIT_TAG_LATEST="v0.0.0"
fi

# Strip prefix 'v' from the tag to easily increment
GIT_TAG_LATEST=$(echo "$GIT_TAG_LATEST" | sed 's/^v//')

# ==================================
# Increment version number
# ==================================

# Get version type from first argument passed to script
VERSION_TYPE="${1-}"
VERSION_NEXT=""

if [ "$VERSION_TYPE" = "patch" ]; then
  # Increment patch version
  VERSION_NEXT="$(echo "$GIT_TAG_LATEST" | awk -F. '{$NF = $NF + 1; print $1"."$2"."$NF}')"
elif [ "$VERSION_TYPE" = "minor" ]; then
  # Increment minor version
  VERSION_NEXT="$(echo "$GIT_TAG_LATEST" | awk -F. '{$2++; $3=0; print $1"."$2"."$3}')"
elif [ "$VERSION_TYPE" = "major" ]; then
  # Increment major version
  VERSION_NEXT="$(echo "$GIT_TAG_LATEST" | awk -F. '{$1++; $2=0; $3=0; print $1"."$2"."$3}')"
else
  # Print error for unknown versioning type
  printf "\nError: invalid VERSION_TYPE arg passed, must be 'patch', 'minor' or 'major'\n\n"
  # Exit with error code
  exit 1
fi

printf "\nLatest build/tag version: v${GIT_TAG_LATEST}\n\n"
read -p "Ready to make a new build with tag v${VERSION_NEXT} and push it to origin. Do you confirm? (y/n): " -n 1 -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  printf "\nAborting...\n\n"
  exit 1
fi

printf "\nProceeding with new build...\n\n"

# Update version in package.json
OS="$(uname)"
if [ "$OS" = "Darwin" ]; then
  sed -i "" -e "s/\"version\": \".*\"/\"version\": \"$VERSION_NEXT\"/g" package.json
elif [ "$OS" = "Linux" ]; then
  sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION_NEXT\"/g" package.json
else
  printf "\nError: unsupported OS type: $OS\n\n"
  exit 1
fi

# Build dist 
yarn run build

# Commit the changes
git add .
git commit -m "build: bump package.json version - v$VERSION_NEXT"

# ==================================
# Create git tag for new version
# ==================================

# Create an annotated tag
git tag -a "v$VERSION_NEXT" -m "Release: v$VERSION_NEXT"

# Optional: push commits and tag to remote 'main' branch
git push --force --follow-tags
