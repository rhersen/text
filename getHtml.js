const foreach = require('lodash.foreach')
const groupby = require('lodash.groupby')
const map = require('lodash.map')
const maxby = require('lodash.maxby')

const delay = require('./delay')
const formatLatestAnnouncement = require('./formatLatestAnnouncement')
const position = require('./position')

function getHtml(announcements, stationNames) {
    let s = '<div id="sheet">'

    const latest = map(groupby(announcements, 'AdvertisedTrainIdent'), v => maxby(v, 'TimeAtLocation'))

    foreach(groupby(latest, direction), (trains, dir) => {
        s += `<h1>${dir}</h1>`

        trains.sort((a, b) => position.y(a.LocationSignature) - position.y(b.LocationSignature))

        foreach(trains, a => {
            s += `<div class="${position.x(a.LocationSignature)} ${delay.className(a)}">`
            s += `${formatLatestAnnouncement(a, stationNames)}`
            s += '</div>'
        })

    })

    s += '</div>'
    return s
}

function direction(t) {
    return /[13579]$/.test(t.AdvertisedTrainIdent) ? 'söderut' : 'norrut'
}

module.exports = getHtml
