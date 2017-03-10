import * as stations from './stations'

export function x(location) {
    const n = wgsNorth(location)

    return n > 59.64 ? 'right' :
        n > 59.407 ? leftRight(location, 17.84) :
            n > 59.36 ? leftRight(location, 18) :
                n < 59.17 ? leftRight(location, 17.84) :
                    n < 59.27 ? leftRight(location, 18) :
                        'center'
}

function leftRight(location, limit) {
    return wgsEast(location) < limit ? 'left' : 'right'
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

function wgsEast(location) {
    const geometry = stations.get(location, 'Geometry')
    return geometry && geometry.WGS84 && geometry.WGS84.east
}

function wgsNorth(location) {
    const geometry = stations.get(location, 'Geometry')
    return geometry && geometry.WGS84 && geometry.WGS84.north
}
