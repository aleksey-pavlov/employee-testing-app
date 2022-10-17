#!/bin/sh
docker-compose exec database sh -c '<< EOF sqlplus system/qwe123@//127.0.0.1:1521/XEPDB1 
                                       @/opt/schemes/appuser.sql
                                       exit;
                                       EOF'
docker-compose exec database sh -c '<< EOF sqlplus empapp/qwe123@//127.0.0.1:1521/XEPDB1
                                       @/opt/schemes/scheme.sql
                                       exit;
                                       EOF'
docker-compose exec database sh -c '<< EOF sqlplus empapp/qwe123@//127.0.0.1:1521/XEPDB1
                                       @/opt/schemes/data.sql
                                       exit;
                                       EOF'