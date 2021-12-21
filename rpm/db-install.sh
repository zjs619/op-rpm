#! /bin/bash
sudo docker load < ./redis.tar.gz
sudo docker load < ./pg.tar.gz
sudo docker load < ./es.tar.gz

sudo mkdir -m 777 -p /mnt/mb/redis/conf /mnt/mb/redis/data /mnt/mb/tsdb/data /mnt/mb/es/data /mnt/volumes/mysql

#  bind 172.31.28.215 修改成本机ip
#  感觉可以优化自动识别ip
cp -p   redis.conf    /mnt/mb/redis/conf/

# 
sudo docker run --net host -v /mnt/mb/redis/conf:/usr/local/etc/redis -v /mnt/mb/redis/data:/data -d --name redis-prod 0x3f.modao.cc:8001/ci-custom:redis-6 redis-server /usr/local/etc/redis/redis.conf

# POSTGRES_PASSWORD数据库密码
sudo docker run --net host -v /mnt/mb/tsdb/data:/var/lib/postgresql/data -d --name tsdb-prod -e TS_TUNE_MEMORY=2GB -e TS_TUNE_NUM_CPUS=1 -e POSTGRES_PASSWORD=imock_on_premises 0x3f.modao.cc:8001/ci-custom:timescaledb-2-pg12


sudo docker run --net host -v /mnt/mb/es/data:/usr/share/elasticsearch/data -d --name es-prod -e "discovery.type=single-node" -e "ES_JAVA_OPTS=-Xms1024m -Xmx1024m" 0x3f.modao.cc:8001/imock-elasticsearch:v0.0.1

# mysql  MYSQL_ROOT_PASSWORD数据库密码

sudo docker load < ./mysql.tgz

sudo docker run --net host -d --name mysql-prod -v /mnt/volumes/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=imock_on_premises 0x3f.modao.cc:8001/ci-custom:mysql-5.7

docker ps -a
