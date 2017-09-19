#!/bin/bash

NGINX=/usr/local/etc/nginx/nginx.conf #Path of nginx.conf on your FreeNAS System
NGINXJAIL=/mnt/Ocean0/jails/Scripts/root/injectTempGUI/nginx.conf #Path of temporary nginx.conf in jail (relative to FreeNAS, not jail)
FREENASUI=/usr/local/www/freenasUI/templates/reporting/index.html #Path of UI Template on FreeNAS
FREENASUIJAIL=/mnt/Ocean0/jails/Scripts/root/injectTempGUI/index.html #Path of temporary UI Template in jail (relative to FreeNAS, not jail)
JAIL=Scripts #Name of your jail (Jails->Jails in FreeNAS UI list the names)
JAILSCRIPT=/root/injectTempGUI/index.js #Path of node script (relative to jail)

cp $NGINX $NGINXJAIL;
cp $FREENASUI $FREENASUIJAIL;
chmod o+rw $NGINXJAIL;
chmod o+rw $FREENASUIJAIL;
jexec $JAIL node $JAILSCRIPT;
ECODE=$?
if [ $ECODE -eq 0 ]; then
  cp $NGINXJAIL $NGINX && cp $FREENASUIJAIL $FREENASUI && rm $NGINXJAIL && service nginx restart
  exit $?;
elif [ $ECODE -eq 1 ]; then
  echo "No need to update";
  exit 0;
else
  echo "Error" >&2;
  exit $ECODE;
fi
