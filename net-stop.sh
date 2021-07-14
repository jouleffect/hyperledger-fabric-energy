#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/../config"

cd "${DIR}/../test-network/"

docker kill cliProduttore cliConsumatore logspout || true
./network.sh down

# remove any stopped containers
#docker rm -f $(docker ps -aq)

cd "${DIR}/organization/produttore/application"

rm -rf wallet/ node_modules/ package-lock.json

cd "${DIR}/organization/consumatore/application"

rm -rf wallet/ node_modules/ package-lock.json