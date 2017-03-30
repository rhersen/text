import filter from 'lodash.filter'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'
import orderby from 'lodash.orderby'
import reject from 'lodash.reject'

import * as position from './position'

export default function current(announcements) {
    const grouped = groupby(announcements, 'AdvertisedTrainIdent')
    const object = filter(map(grouped, announcementsToObject), 'actual')
    const sorted = sortTrains(object, direction(announcements))
    return reject(sorted, hasArrivedAtDestination)
}

function announcementsToObject(v) {
    const actual = maxby(filter(v, 'TimeAtLocation'), a => a.TimeAtLocation + a.ActivityType)
    const next = actual && actual.ActivityType === 'Avgang' && filter(reject(v, 'TimeAtLocation'), {ActivityType: 'Ankomst'})[0]

    return {actual, next}
}

function sortTrains(object, dir) {
    return orderby(object, [a => position.y(a.actual.LocationSignature), 'actual.ActivityType', 'actual.TimeAtLocation'], ['asc', dir ? 'asc' : 'desc', dir ? 'desc' : 'asc'])
}

function direction(announcements) {
    return announcements.length && /\d\d\d[13579]/.test(announcements[0].AdvertisedTrainIdent)
}

function hasArrivedAtDestination(train) {
    return train.actual.ActivityType === 'Ankomst' && map(train.actual.ToLocation, 'LocationName').join() === train.actual.LocationSignature
}
