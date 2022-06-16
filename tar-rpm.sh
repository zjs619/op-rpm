#! /bin/bash

tar -zcf rpm.tar.gz rpm
scp rpm.tar.gz nfs:/srv/http/
