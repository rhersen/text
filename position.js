import * as stations from './stations'

export function x(location) {
    const n = wgsNorth(location)
    const e = wgsEast(location)

    return n > 59.27 && n < 59.35 ? 'center' :
        n > 59.58 ? 'right' :
            n < 59.08 && e > 17.84 ? 'right' :
                e > 17.898 && n > 59.37 ? 'right' :
                    e > 18 ? 'right' :
                        'left'
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
