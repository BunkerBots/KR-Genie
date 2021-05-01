#!/bin/bash
if [ "$GITHUB_TOKEN" != "" ]; then
    echo "Detected GITHUB_TOKEN. Setting git config to use the security token" >&1
    git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf git@github.com:
fi