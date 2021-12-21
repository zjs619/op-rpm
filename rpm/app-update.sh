#! /bin/bash
# 执行脚本. ./app-update.sh
systemctl restart docker
sudo mkdir -p /mnt/mb/deploy/ && chmod 777 /mnt/mb/deploy/
tar -xvf modao.*.tar.gz -C /mnt/mb/deploy/
mv /mnt/mb/deploy/config2/launchpad/*/* /mnt/mb/deploy/
cd /mnt/mb/deploy
sleep 1
ls -lh
sleep 3
node /mnt/mb/deploy/platter-gitignore.js host-verify host-setup-base
node /mnt/mb/deploy/platter-gitignore.js host-docker-image-pack-load
sleep 3
node /mnt/mb/deploy/platter-gitignore.js jc-imock-app-pack-load
node /mnt/mb/deploy/platter-gitignore.js jc-backup-setup jc-prod-setup

# 数据库 jc-imock-app-db-update / jc-imock-app-db-setup
# node /mnt/mb/deploy/platter-gitignore.js jc-imock-app-db-update

node /mnt/mb/deploy/platter-gitignore.js jc-down
node /mnt/mb/deploy/platter-gitignore.js jc-up
node /mnt/mb/deploy/platter-gitignore.js jc ps
sleep 200
node /mnt/mb/deploy/platter-gitignore.js host-up
