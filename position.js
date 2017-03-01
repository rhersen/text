import includes from 'lodash.includes'

import * as stations from './stations'

const old = [['Äs', 'Åbe', 'Sst', 'Cst', 'Ke'],
    ['Sub', 'Spå', 'Bkb', 'Jkb', 'Khä', 'Kän', 'Bro', 'Bål'],
    ['So', 'Udl', 'Hel', 'Sol', 'Hgv', 'Nvk', 'R', 'Upv', 'Rs', 'Mr', 'Arnc', 'Kn', 'U'],
    ['Sta', 'Hu', 'Flb', 'Tul', 'Tu', 'Rön', 'Öte', 'Söd', 'Söc', 'Söu', 'Jn', 'Mö', 'Gn'],
    ['Fas', 'Tåd', 'Skg', 'Hnd', 'Jbo', 'Vhe', 'Kda', 'Ts', 'Hfa', 'Ssä', 'Öso', 'Ngd', 'Gdv', 'Nyh']]

export function x(location) {
    return includes(old[3], location) ? 'left' :
        includes(old[1], location) ? 'left' :
            includes(old[0], location) ? 'center' :
                'right'
}

export function y(location) {
    return -north(location)
}

function north(location) {
    return location === 'Gdv' ? between('Ngd', 'Nyh') :
        location === 'Söc' ? between('Söd', 'Söu') :
            location === 'Gn' ? between('Mö', 'Ssä') :
                wgsNorth(location)
}

function between(loc1, loc2) {
    return (wgsNorth(loc1) + wgsNorth(loc2)) / 2
}

function wgsNorth(location) {
    const geometry = stations.get(location, 'Geometry')
    return geometry && geometry.WGS84 && geometry.WGS84.north
}
