#!/usr/bin/bash
if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Not running as root"
    exit
fi

mariadb -u root < createuser.sql
mariadb -u root < initdb.sql