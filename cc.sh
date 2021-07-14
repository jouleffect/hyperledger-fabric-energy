#!/bin/bash

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/../config"

cd "${DIR}/../test-network/"

./network.sh deployCC -ccn mychain -ccp ${DIR}/organization/produttore/contract -ccl javascript

cd  "${DIR}/organization/produttore/"

./produttore.sh

cd  "${DIR}/organization/consumatore/"

./consumatore.sh