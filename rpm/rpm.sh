#! /bin/bash
## docker
mv  docker/*   /usr/bin/
cp -p docker.service  /usr/lib/systemd/system/
systemctl daemon-reload
systemctl enable docker.service --now
systemctl restart  docker.service

## docker-compose

sudo mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose 

sudo chmod +x /usr/local/bin/docker-compose

docker-compose -v

sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose 

## nodejs
tar -xvf node-v16.13.1-linux-x64.tar.xz -C /opt/
ln -s /opt/node-v16.13.1-linux-x64/bin/node /usr/bin/node
ln -s /opt/node-v16.13.1-linux-x64/bin/npm /usr/bin/npm
ln -s /opt/node-v16.13.1-linux-x64/bin/npx /usr/bin/npx

echo 'export NODE_HOME=/opt/node-v16.13.1-linux-x64' >> /etc/profile
echo 'export PATH=$PATH:$NODE_HOME/bin' >> /etc/profile
echo 'export NODE_PATH=$NODE_HOME/lib/node_modules' >> /etc/profile

source /etc/profile


## NFS
rpm -Uvh nfs_util/*.rpm --nodeps --force


docker -v && docker-compose -v && npm -v && node -v && npx -v

## chmod
chmod +x app-install.sh
chmod +x app-rm.sh
chmod +x db-install.sh 
chmod +x sc.sh
