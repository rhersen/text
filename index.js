import format from 'date-fns/format'
import getHtml from './getHtml'

let stations

const root = document.getElementById('root')
root.insertAdjacentHTML('afterbegin', '<button id="update" style="font-size: 24px">söderut</button>')
const buttonSouth = root.firstElementChild
root.insertAdjacentHTML('afterbegin', '<button id="update" style="font-size: 24px">norrut</button>')
const buttonNorth = root.firstElementChild
root.insertAdjacentHTML('beforeend', '<div id="sheet"/>')

buttonSouth.onclick = getCurrent('s')
buttonNorth.onclick = getCurrent('n')

getStations()

function getCurrent(direction) {
    return function () {
        const xhr = new XMLHttpRequest()
        xhr.onload = handleCurrent
        xhr.open('GET', `/json/current?direction=${direction}`, true)
        xhr.send()
    }
}

function getStations() {
    const xhr = new XMLHttpRequest()
    xhr.onload = handleStations
    xhr.open('GET', '/json/stations', true)
    xhr.send()
}

function handleStations() {
    if (this.status >= 200 && this.status < 400) {
        const trainStations = JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation
        stations = {}
        trainStations.forEach(entry => stations[entry.LocationSignature] = entry.AdvertisedShortLocationName)
    } else
        document.getElementById('sheet').outerHTML = `<span id="sheet">${this.status} ${this.responseText}</span>`
}

function handleCurrent() {
    if (this.status >= 200 && this.status < 400) {
        const result = JSON.parse(this.response).RESPONSE.RESULT[0]
        const lastModified = format(result.INFO.LASTMODIFIED['@datetime'], 'H:mm:ss')
        document.getElementById('sheet').outerHTML = getHtml(result.TrainAnnouncement, stations, lastModified)
    } else
        document.getElementById('sheet').outerHTML = `<span id="sheet">${this.status} ${this.responseText}</span>`
}
