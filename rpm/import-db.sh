#! /bin/bash
cd /mnt/mb/deploy/
wget https://edge.modao.cc/__dev__/ljy-20211216.tar
tar -xf ljy-20211216.tar
node /mnt/mb/deploy/platter-gitignore.js jc-chalice-import-v1 op-org ljy-20211216
