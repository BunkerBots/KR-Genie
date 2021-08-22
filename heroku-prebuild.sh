#!/bin/bash
if [ "$GITHUB_TOKEN" != "" ]; then
    echo "Detected GITHUB_TOKEN. Setting git config to use the security token" >&1
    echo "https://$GITHUB_TOKEN@github.com" > ~/.git-credentials
    git config --global credential.helper store
fi
