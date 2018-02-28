const NginxConfFile = require('nginx-conf').NginxConfFile
const path = require('path')
const commandLineArgs = require('command-line-args')
const jsesc = require('jsesc')
const fs = require('fs')

const options = commandLineArgs([
  {name: 'confPath', alias: 'c', type: String, defaultValue: path.join(__dirname, '/nginx.conf')}, // path of nginx.conf file to be updated
  {name: 'dojoPath', alias: 'd', type: String, defaultValue: path.join(__dirname, '/index.html')}, // path of GUI template file to be updated
  {name: 'tempPath', alias: 't', type: String, defaultValue: '/temps'}, // nginx path for temps. i.e. freenas.local/temp
  {name: 'tempAlias', alias: 'a', type: String, defaultValue: '/mnt/Ocean0/Misc/temperature-monitoring'}, // alias path that the temps images are in
  {name: 'verbose', alias: 'v', type: Boolean, defaultValue: false} // Enables verbose logging/debugging
])

let needsUpdating = false

if (options.verbose) console.log('Started')

try {
  // UI
  if (options.verbose) console.log('Reading GUI template')
  let data = fs.readFileSync(options.dojoPath)
  if (!data) {
    console.error('Error loading GUI html')
    process.exit(2)
  } else {
    if (options.verbose) console.log('Read GUI')
    let uiTemplate = data.toString()
    let tempsRE = new RegExp('href: \'' + jsesc(options.tempPath) + '\',', 'g')

    if (uiTemplate.match(tempsRE)) {
      if (options.verbose) console.log('GUI already has the header in it')
      console.log('Header already set in template')
    } else {
      if (options.verbose) console.log('GUI doesn\'t have the header in it')
      console.log('Adding to UI Template')
      let outerDivRE = new RegExp(/^<\/div>/m)
      var output = uiTemplate.replace(outerDivRE, `  <div data-dojo-type="dijit.layout.ContentPane" data-dojo-props="title: '{% trans "Temperature" %}', href: '` + options.tempPath + `', refreshOnShow: true"></div>\n\n</div>\n`)
      if (options.verbose) console.log('Header added to GUI')
      fs.writeFileSync(options.dojoPath, output)
      if (options.verbose) console.log('Wrote GUI out')
      needsUpdating = true
    }
  }

  // NGINX
  if (options.verbose) console.log('Reading NGINX Conf')
  NginxConfFile.create(options.confPath, function (err, conf) {
    conf.on('flushed', function () {
      if (options.verbose) console.log('NGINX Conf flushed')
    })
    if (err) {
      console.error('Error reading in conf file: ' + err)
      process.exit(2)
    }
    if (options.verbose) console.log('Read NGINX Conf')

    let needsLocation = true
    let server = conf.nginx.http.server[0] || conf.nginx.http.server
    if (server !== undefined) {
      if (options.verbose) console.log('Searching for Location')
      for (let i = 0; i < server.location.length; i++) {
        let location = server.location[i]
        if (location._value === options.tempPath) {
          console.log('Location already exists')
          conf.die(options.confPath)
          needsLocation = false
          break
        }
      }

      if (needsLocation) {
        console.log('Adding location to NGINX')
        let locationIndex = server.location.length
        server._add('location', options.tempPath)
        let location = server.location[locationIndex]
        location._add('alias', options.tempAlias)
        location._comments.push('Auto generated by injectTempGUI')
        conf.flush()
        needsUpdating = true
        if (options.verbose) console.log('Wrote NGINX out')
      }
    }

    if (!needsUpdating) {
      if (options.verbose) console.log('Finished: doesn\'t need updating')
      process.exit(1)
    } else {
      if (options.verbose) console.log('Finished: needs updating')
      // process.exit(0)
    }
  })
} catch (e) {
  console.error('Exception caught: ' + e)
  process.exit(2)
}
