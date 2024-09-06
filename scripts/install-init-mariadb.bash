#!/usr/bin/env bash

if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "EXITING: please run as root"
    exit
fi

pacman -Syu mariadb

mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql

