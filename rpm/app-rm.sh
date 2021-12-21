#! /bin/bash
ls -ls /mnt/mb/deploy/
sudo node /mnt/mb/deploy/platter-gitignore.js host-down
sudo mv -f /mnt/mb/deploy /mnt/mb/deploy`date +%y%m%d`
sleep 1
sudo df -h
docker -v && docker-compose -v && npm -v && node -v
