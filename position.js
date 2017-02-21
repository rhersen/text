import findindex from 'lodash.findindex'
import includes from 'lodash.includes'

const stations = [['Äs', 'Åbe', 'Sst', 'Cst', 'Ke'],
    ['Sub', 'Spå', 'Bkb', 'Jkb', 'Khä', 'Kän', 'Bro', 'Bål'],
    ['So', 'Udl', 'Hel', 'Sol', 'Hgv', 'Nvk', 'R', 'Upv', 'Rs', 'Mr', 'Arnc', 'Kn', 'U'],
    ['Sta', 'Hu', 'Flb', 'Tul', 'Tu', 'Rön', 'Öte', 'Söd', 'Söc', 'Söu', 'Jn', 'Mö', 'Gn'],
    ['Fas', 'Tåd', 'Skg', 'Hnd', 'Jbo', 'Vhe', 'Kda', 'Ts', 'Hfa', 'Ssä', 'Öso', 'Ngd', 'Gdv', 'Nyh']]

export function x(location) {
    return includes(stations[3], location) ? 'left' :
        includes(stations[1], location) ? 'left' :
            includes(stations[0], location) ? 'center' :
                'right';
}

export function y(location) {
    const n = findindex(stations, s => s.indexOf(location) !== -1)
    const number = stations[n].indexOf(location)

    return n === 0 ? 3 - number :
        n === 1 ? -3 - 2 * number :
            n === 2 ? -2 - 2 * number :
                n === 3 ? 4 + 2 * number :
                    n === 4 ? 5 + 2 * number :
                        0;
}
