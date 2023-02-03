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

regLink=$(docker exec sharelatex /bin/bash -c "cd /var/www/sharelatex; grunt user:create-admin --email=admin@domain.com" | grep http | sed 's#localhost#localhost:888#g')
echo "${regLink}"
token=$(echo "${regLink}" | awk -F'?' '{print $2}' | awk -F'&' '{print $1}' | awk -F'=' '{print $2}')
echo "${token}"

# curl -vvv ${regLink}
curl -vvv --data 'password=very1Bad#' --data 'email=admin@domain.com' ${regLink} 

# Exit
printf "${MAGENTA}"
message "All done! Login at http://localhost:888/login with username 'admin@domain.com' and password 'very1Bad#'"
printf "${NC}"
