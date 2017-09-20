# FreeNASTempsGUI

* For use with https://github.com/seren/freenas-temperature-graphing
* See https://github.com/seren/freenas-temperature-graphing/issues/12 for reference

1. Move `index.js` and `package*.json` to a directory in a jail
2. `npm i` in said directory
3. Move `injectTempGUI.sh` to your main system
4. Edit the vars in [`injectTempGUI.sh`](https://github.com/GusGold/FreeNASTempsGUI/blob/master/injectTempGUI.sh#L3-L6) to match your setup (You don't have to make the `nginx.conf` and `index.html` files in the jail. This script will create them for you)
5. Edit the `defaultValue`s in [`index.js`](https://github.com/GusGold/FreeNASTempsGUI/blob/master/index.js#L7-L10) (probably only need to change `tempAlias` to match the location of https://github.com/seren/freenas-temperature-graphing graphs)
6. Add a cron job for `injectTempGUI.sh` every hour or to your liking
