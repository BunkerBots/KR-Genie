#!/bin/bash
if [ "$GITHUB_SSH_KEY" != "" ]; then
    echo "Detected GITHUB_SSH_KEY. Setting git config to use the security token" >&1
    git config --global url.ssh://git@github.com/.insteadOf https://github.com/
fi