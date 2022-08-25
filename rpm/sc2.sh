#! /bin/bash
# 143
# cp -rp deploy-sc/* /mnt/mb/deploy/
# source /etc/profile
# node /mnt/mb/deploy/platter-gitignore.js jc-chalice-import-v1 batch:project-upper /mnt/mb/deploy/exchange-gitignore/export/e-batch-mkt-official-143/.batch-config.json

# 159

# cd /mnt/mb/deploy/
# wget https://edge.modao.cc/__dev__/export-v1-mkt-official.20211207.js
# wget https://edge.modao.cc/__dev__/e-batch-mkt-official-159.tgz
# wget https://edge.modao.cc/__dev__/dr-js-core-0.4.22.tgz # npm pack @dr-js/core@0.4
# mkdir -p ./exchange-gitignore/export/
# mv e-batch-mkt-official-*.tgz ./exchange-gitignore/export/

cp -rp deploy-sc2/*  /mnt/mb/deploy/ 
cd /mnt/mb/deploy/
mkdir -p /mnt/mb/deploy/exchange-gitignore/export/
mv e-batch-mkt-official-*.tgz ./exchange-gitignore/export/
EXPORT_V1_DEBUG=true npx dr-js-core-0.4.*.tgz -I export-v1-mkt-official.*.js -e import


