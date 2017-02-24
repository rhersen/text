/* eslint better/explicit-return: 0, fp/no-let: 0, fp/no-mutation: 0 */

import keyby from 'lodash.keyby'

let stations = {}

export function set(trainStations) {
    return stations = keyby(trainStations, 'LocationSignature')
}

export function get(locationSignature, field) {
    return stations && stations[locationSignature] && stations[locationSignature][field]
}