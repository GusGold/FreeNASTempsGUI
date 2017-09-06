# FreeNASTempsGUI

* For use with https://github.com/seren/freenas-temperature-graphing
* See https://github.com/seren/freenas-temperature-graphing/issues/12 for reference

1. Move `index.js` and `package*.json` to a directory in a jail
2. `npm i` in said directory
3. Move `injectTempGUI.sh` to your main system
4. Edit the vars in [`injectTempGUI.sh`](https://github.com/GusGold/FreeNASTempsGUI/blob/master/injectTempGUI.sh#L3-L6) to match your setup
5. Add a cron job for `injectTempGUI.sh` every hour or to your liking
