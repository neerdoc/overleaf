#!/usr/bin/env bash

# Use this file to start the build.

# Always die on error
set -e

# Get the folder name of _this_ script
SRCDIR="$( cd "${BASH_SOURCE[0]%/*}" >/dev/null 2>&1 && pwd )"
# Get the folder of the executing instance
TARGET=$(pwd)
source MANIFEST

# Get common stuff
source ${SRCDIR}/modules/scripts/common/shell.sh

# Start container
printf "${MAGENTA}"
message "Creating admin user!"
printf "${NC}"

docker exec sharelatex /bin/bash -c "cd /var/www/sharelatex; grunt user:create-admin --email=admin@domain.com"

# Exit
printf "${MAGENTA}"
message "All done!"
printf "${NC}"
