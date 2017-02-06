import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'

import * as position from './position'

export default function latestAnnouncementForEachTrain(announcements) {
    const trains = map(groupby(announcements, 'AdvertisedTrainIdent'), v => maxby(v, 'TimeAtLocation'))
    trains.sort((a, b) => position.y(a.LocationSignature) - position.y(b.LocationSignature))
    return trains
}
