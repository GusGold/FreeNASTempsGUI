#!/bin/bash

NGINX=/usr/local/etc/nginx/nginx.conf
NGINXJAIL=/mnt/Ocean0/jails/Scripts/root/injectTempGUI/nginx.conf
JAIL=Scripts
JAILSCRIPT=/root/injectTempGUI/index.js

cp $NGINX $NGINXJAIL;
chmod o+rw $NGINXJAIL;
jexec $JAIL node $JAILSCRIPT;
ECODE=$?
if [ $ECODE -eq 0 ]; then
  cp $NGINXJAIL $NGINX && rm $NGINXJAIL && service nginx restart
  exit $?;
elif [ $ECODE -eq 1 ]; then
  echo "No need to update";
  exit 0;
else
  echo "Error" >&2;
  exit $ECODE;
fi
