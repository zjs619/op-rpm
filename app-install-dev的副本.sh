#! /bin/bash
# 执行脚本. ./app-install.sh

PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH
LANG=en_US.UTF-8

if [ $(whoami) != "root" ];then
        echo "请使用root权限执行墨刀安装命令！"
        exit 1;
fi

is64bit=$(getconf LONG_BIT)
if [ "${is64bit}" != '64' ];then
        Red_Error "抱歉, 当前不支持32位系统, 请使用64位系统安装墨刀!";
fi

Centos6Check=$(cat /etc/redhat-release | grep ' 6.' | grep -iE 'centos|Red Hat')
if [ "${Centos6Check}" ];then
        echo "Centos6不支持安装墨刀，请更换Centos7/8安装"
        exit 1
fi

UbuntuCheck=$(cat /etc/issue|grep Ubuntu|awk '{print $2}'|cut -f 1 -d '.')
if [ "${UbuntuCheck}" -lt "16" ];then
        echo "Ubuntu ${UbuntuCheck}不支持安装墨刀，建议更换Ubuntu18/20安装"
        exit 1
fi

DockerCheck=$(docker -v | grep version  |awk '{print $3}'|cut -f 1 -d '.')

if [ "${DockerCheck}"  -lt "20" ];then
        echo " $(docker -v) ,版本低于${DockerCheck}.10.7，不支持安装墨刀，请升级Docker"
        exit 1
fi

DockerCheck2=$(docker -v | grep version  |awk '{print $3}'|cut -f 2 -d '.')

if [ "${DockerCheck2}"  -lt "10" ];then
        echo " $(docker -v) ,版本低于20.10.7，不支持安装墨刀，请升级Docker"
        exit 1
fi
DockerComposeCheck=$(docker-compose -v | grep version  |awk '{print $3}'|cut -f 2 -d '.')

if [ "${DockerComposeCheck}"  -lt "29" ];then
        echo " $(docker-compose -v) ,  版本低于1.29.2，不支持安装墨刀，请升级Docker Composer"
        exit 1
fi

NodejsCheck=$(node -v |cut -f 1 -d '.'| cut -b 2-3)

if [ "${NodejsCheck}"  -lt "16" ];then
        echo " Nodejs $(node -v) 版本低于16.13.1，不支持安装墨刀，请升级Nodejs"
        exit 1
fi
NPMCheck=$(npm -v |cut -f 1 -d '.')

if [ "${NPMCheck}"  -lt "6" ];then
        echo " npm  $(npm -v)  版本低于6.14.15，不支持安装墨刀，请升级npm"
        exit 1
fi
NPM2Check=$(npm -v |cut -f 2 -d '.')

if [ "${NPMCheck}"  -eq "6" ] && [ "${NPM2Check}"  -lt "14" ];then
        echo " npm $(npm -v)  版本低于6.14.15，不支持安装墨刀，请升级npm"
        exit 1
fi
NPXCheck=$(npx -v |cut -f 1 -d '.')

if [ "${NPXCheck}"  -lt "6" ];then
        echo " npx $(npx -v)  版本低于6.14.15，不支持安装墨刀，请升级npx"
        exit 1
fi
NPX2Check=$(npx -v |cut -f 2 -d '.')

if [ "${NPXCheck}"  -eq "6" ] && [ "${NPX2Check}"  -lt "14" ];then
        echo " npx $(npx -v) 版本低于6.14.15，不支持安装墨刀，请升级npx"
        exit 1
fi

cpu_cpunt=$(cat /proc/cpuinfo|grep processor|wc -l)

if [ "$1" ];then
        IDC_CODE=$1
fi



echo '==================================================';

echo ok

#systemctl restart docker
#sudo mkdir -p /mnt/mb/deploy/ && chmod 777 /mnt/mb/deploy/
#tar -xvf modao.*.tar.gz -C /mnt/mb/deploy/
#mv /mnt/mb/deploy/config2/launchpad/*/* /mnt/mb/deploy/
#cd /mnt/mb/deploy
#sleep 1
#ls -lh
#sleep 3
#node /mnt/mb/deploy/platter-gitignore.js host-verify host-setup-base
#node /mnt/mb/deploy/platter-gitignore.js host-docker-image-pack-load
#sleep 3
#node /mnt/mb/deploy/platter-gitignore.js jc-imock-app-pack-load
#node /mnt/mb/deploy/platter-gitignore.js jc-backup-setup jc-prod-setup

## 数据库 jc-imock-app-db-update / jc-imock-app-db-setup
#node /mnt/mb/deploy/platter-gitignore.js jc-imock-app-db-setup

#node /mnt/mb/deploy/platter-gitignore.js jc-down
#node /mnt/mb/deploy/platter-gitignore.js jc-up
#node /mnt/mb/deploy/platter-gitignore.js jc ps
#sleep 200
#node /mnt/mb/deploy/platter-gitignore.js host-up