/* eslint better/explicit-return: 0, better/no-new: 0, fp/no-mutation: 0, fp/no-nil: 0, fp/no-this: 0, fp/no-unused-expression: 0 */

import format from 'date-fns/format'

import getHtml from './getHtml'
import * as stations from './stations'

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
    return this.status >= 200 && this.status < 400 ?
        stations.set(JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation) :
        document.getElementById('sheet').outerHTML = `<span id="sheet">${this.status} ${this.responseText}</span>`
}

function handleCurrent() {
    function setOuterHtml(result) {
        document.getElementById('sheet').outerHTML = getHtml(result.TrainAnnouncement, format(result.INFO.LASTMODIFIED['@datetime'], 'H:mm:ss'))
    }

    return this.status >= 200 && this.status < 400 ?
        setOuterHtml(JSON.parse(this.response).RESPONSE.RESULT[0]) :
        document.getElementById('sheet').outerHTML = `<span id="sheet">${this.status} ${this.responseText}</span>`
}
