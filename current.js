import filter from 'lodash.filter'
import map from 'lodash.map'
import reject from 'lodash.reject'

import groupAnnouncements from './groupAnnouncements'

export default function current(announcements) {
    return reject(groupAnnouncements(filter(announcements, 'TimeAtLocation')), hasArrivedAtDestination)
}

function hasArrivedAtDestination(a) {
    return a.ActivityType === 'Ankomst' && map(a.ToLocation, 'LocationName').join() === a.LocationSignature
}
