/* eslint better/explicit-return: 0, fp/no-nil: 0, fp/no-unused-expression: 0 */

import {expect} from 'chai'

import current from '../current'
import * as position from '../position'
import * as stations from '../stations'

describe('current', function () {
    beforeEach(function () {
        stations.set(trainStations)
    })

    it('returns empty array', function () {
        expect(current([])).to.be.an('array').that.is.empty
    })

    it('does nothing to single train', function () {
        const announcement = {
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-02T07:11:00'
        }
        expect(current([announcement])[0].actual).to.deep.equal(announcement)
    })

    it('removes arrival to ToLocation', function () {
        const actual = current([{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tul',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:42:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tu',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:45:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2611',
            'LocationSignature': 'Åbe',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:37:00'
        }])

        expect(actual)
            .to.be.an('array').of.length(1)
            .with.deep.property('[0].actual.AdvertisedTrainIdent')
            .that.equals('2611')
    })

    it('removes trains that have no TimeAtLocation', function () {
        const actual = current([{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tul',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}]
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2611',
            'LocationSignature': 'Åbe',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:37:00'
        }])

        expect(actual)
            .to.be.an('array').of.length(1)
            .with.deep.property('[0].actual.AdvertisedTrainIdent')
            .that.equals('2611')
    })

    it('Avgang is considered more recent than Ankomst', function () {
        const announcements = [{
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }]

        const actual = current(announcements)

        expect(actual[0].actual.ActivityType).to.equal('Avgang')
    })

    it('sorts Avgang below Ankomst for southbound', function () {
        const announcements = [{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2653',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-07T18:11:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2853',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-07T18:12:00'
        }]

        const actual = current(announcements)

        expect(actual[0].actual.ActivityType).to.equal('Ankomst')
        expect(actual[1].actual.ActivityType).to.equal('Avgang')
    })

    it('sorts northbound by time, ascending, if ActivityType is same', function () {
        const announcements = [{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2664',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-06T20:49:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2864',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-06T20:48:00'
        }]

        const actual = current(announcements)

        expect(actual[0].actual.TimeAtLocation).to.match(/20:48/)
        expect(actual[1].actual.TimeAtLocation).to.match(/20:49/)
    })

    it('no next if latest is arrival', function () {
        const announcements = [{
            'ActivityType': 'Ankomst',
            'AdvertisedTimeAtLocation': '2017-03-29T07:21:00',
            'AdvertisedTrainIdent': '2212',
            'LocationSignature': 'Hu',
            'TimeAtLocation': '2017-03-29T07:21:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTimeAtLocation': '2017-03-29T07:21:00',
            'AdvertisedTrainIdent': '2212',
            'LocationSignature': 'Hu',
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTimeAtLocation': '2017-03-29T07:24:00',
            'AdvertisedTrainIdent': '2212',
            'LocationSignature': 'Sta',
        }]

        expect(current(announcements)[0].actual.TimeAtLocation).to.match(/7:21/)
        expect(current(announcements)[0].next.AdvertisedTimeAtLocation).to.match(/7:21/)
        expect(current(announcements)[0].next.ActivityType).to.equal('Avgang')
    })

    it('next returns arrival, not departure', function () {
        const announcements = [{
            'ActivityType': 'Avgang',
            'AdvertisedTimeAtLocation': '2017-03-30T07:29:00',
            'AdvertisedTrainIdent': '2211',
            'LocationSignature': 'Åbe',
            'EstimatedTimeAtLocation': '2017-03-30T07:31:00',
            'TimeAtLocation': '2017-03-30T07:30:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTimeAtLocation': '2017-03-30T07:32:00',
            'AdvertisedTrainIdent': '2211',
            'LocationSignature': 'Äs',
            'EstimatedTimeAtLocation': '2017-03-30T07:34:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTimeAtLocation': '2017-03-30T07:32:00',
            'AdvertisedTrainIdent': '2211',
            'LocationSignature': 'Äs',
            'EstimatedTimeAtLocation': '2017-03-30T07:33:00'
        }]

        expect(current(announcements)[0].actual.TimeAtLocation).to.match(/7:30/)
        expect(current(announcements)[0].next.EstimatedTimeAtLocation).to.match(/7:33/)
    })

    it('sorts southbound by time, descending, if ActivityType is same', function () {
        const announcements = [{
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2849',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-07T17:01:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2949',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-07T17:05:00'
        }]

        const actual = current(announcements)

        expect(actual[0].actual.TimeAtLocation).to.match(/17:05/)
        expect(actual[1].actual.TimeAtLocation).to.match(/17:01/)
    })
})

describe('position', function () {
    beforeEach(function () {
        stations.set(trainStations)
    })

    describe('x', function () {
        it('left', function () {
            expect(position.x('Bål')).to.equal('left')
            expect(position.x('Jkb')).to.equal('left')
            expect(position.x('Bkb')).to.equal('left')
            expect(position.x('Sub')).to.equal('left')
            expect(position.x('Sta')).to.equal('left')
            expect(position.x('Mö')).to.equal('left')
        })

        it('center', function () {
            expect(position.x('Ke')).to.equal('center')
            expect(position.x('Äs')).to.equal('center')
        })
        it('right', function () {
            expect(position.x('Kn')).to.equal('right')
            expect(position.x('Mr')).to.equal('right')
            expect(position.x('Arnc')).to.equal('right')
            expect(position.x('Rs')).to.equal('right')
            expect(position.x('Upv')).to.equal('right')
            expect(position.x('R')).to.equal('right')
            expect(position.x('Hel')).to.equal('right')
            expect(position.x('Udl')).to.equal('right')
            expect(position.x('Fas')).to.equal('right')
            expect(position.x('Hfa')).to.equal('right')
        })
    })

    describe('y', function () {
        describe('sorts according to location, north to south', function () {
            it('within each branch', function () {
                expect(position.y('Udl')).to.be.above(position.y('Upv'))
                expect(position.y('Sst')).to.be.above(position.y('Cst'))
                expect(position.y('Bkb')).to.be.above(position.y('Bro'))
                expect(position.y('Tul')).to.be.above(position.y('Flb'))
                expect(position.y('Nyh')).to.be.above(position.y('Fas'))
            })

            it('between branches', function () {
                expect(position.y('Cst')).to.be.above(position.y('Udl'))
                expect(position.y('Cst')).to.be.above(position.y('Sub'))
                expect(position.y('Flb')).to.be.above(position.y('Sst'))
                expect(position.y('Fas')).to.be.above(position.y('Sst'))
            })

            it('Gröndalsviken between Nynäsgård and Nynäshamn', function () {
                expect(position.y('Gdv')).to.be.above(position.y('Ngd'))
                expect(position.y('Nyh')).to.be.above(position.y('Gdv'))
            })

            it('Södertälje Centrum between Hamn and Syd', function () {
                expect(position.y('Söc')).to.be.above(position.y('Söd'))
                expect(position.y('Söu')).to.be.above(position.y('Söc'))
            })

            it('Gnesta after Mölnbo', function () {
                expect(position.y('Gn')).to.be.above(position.y('Mö'))
            })
        })
    })
})

const trainStations = [{
    'Geometry': {'WGS84': {'east': 17.9284893924452, 'north': 59.6490721208678}}, 'LocationSignature': 'Arnc'
}, {
    'Geometry': {'WGS84': {'east': 17.8636783437106, 'north': 59.4054464125127}}, 'LocationSignature': 'Bkb'
}, {
    'Geometry': {'WGS84': {'east': 17.6329583487067, 'north': 59.5123000136841}}, 'LocationSignature': 'Bro'
}, {
    'Geometry': {'WGS84': {'east': 18.0572670185758, 'north': 59.3299708428723}}, 'LocationSignature': 'Cst'
}, {
    'Geometry': {'WGS84': {'east': 17.9478417984456, 'north': 59.2192614898848}}, 'LocationSignature': 'Flb'
}, {
    'Geometry': {'WGS84': {'east': 18.1041371217327, 'north': 59.2367049603428}}, 'LocationSignature': 'Fas'
}, {
    'Geometry': {'WGS84': {'east': 17.9317290389689, 'north': 58.8992532022516}}, 'LocationSignature': 'Gdv'
}, {
    'Geometry': {'WGS84': {'east': 17.9631198951495, 'north': 59.4085359646815}}, 'LocationSignature': 'Hel'
}, {
    'Geometry': {'WGS84': {'east': 17.9765802941488, 'north': 59.0687886825316}}, 'LocationSignature': 'Hfa'
}, {
    'Geometry': {'WGS84': {'east': 17.8331196186415, 'north': 59.4238058774284}}, 'LocationSignature': 'Jkb'
}, {
    'Geometry': {'WGS84': {'east': 18.0284109437907, 'north': 59.3402692354015}}, 'LocationSignature': 'Ke'
}, {
    'Geometry': {'WGS84': {'east': 17.861556068155, 'north': 59.6277190922148}}, 'LocationSignature': 'Mr'
}, {
    'Geometry': {'WGS84': {'east': 17.4182880540071, 'north': 59.0473611846192}}, 'LocationSignature': 'Mö'
}, {
    'Geometry': {'WGS84': {'east': 17.9425294893135, 'north': 58.913736221869}}, 'LocationSignature': 'Ngd'
}, {
    'Geometry': {'WGS84': {'east': 17.9499318421396, 'north': 58.9003126162184}}, 'LocationSignature': 'Nyh'
}, {
    'Geometry': {'WGS84': {'east': 17.879821813887, 'north': 59.5843599154224}}, 'LocationSignature': 'Rs'
}, {
    'Geometry': {'WGS84': {'east': 17.9152982601902, 'north': 59.4755142340393}}, 'LocationSignature': 'R'
}, {
    'Geometry': {'WGS84': {'east': 18.0605085396167, 'north': 59.3134227390133}}, 'LocationSignature': 'Sst'
}, {
    'Geometry': {'WGS84': {'east': 17.9271105955665, 'north': 59.0295048975674}}, 'LocationSignature': 'Ssä'
}, {
    'Geometry': {'WGS84': {'east': 17.9971886396718, 'north': 59.2546617015652}}, 'LocationSignature': 'Sta'
}, {
    'Geometry': {'WGS84': {'east': 17.9718245614723, 'north': 59.3608383170324}}, 'LocationSignature': 'Sub'
}, {
    'Geometry': {'WGS84': {'east': 17.6283502455854, 'north': 59.1911449201246}}, 'LocationSignature': 'Söc'
}, {
    'Geometry': {'WGS84': {'east': 17.6472154570982, 'north': 59.1776349084721}}, 'LocationSignature': 'Söd'
}, {
    'Geometry': {'WGS84': {'east': 17.6454864871351, 'north': 59.1634199957082}}, 'LocationSignature': 'Söu'
}, {
    'Geometry': {'WGS84': {'east': 17.9052694195429, 'north': 59.2056989275289}}, 'LocationSignature': 'Tul'
}, {
    'Geometry': {'WGS84': {'east': 18.0012905848179, 'north': 59.3797706297159}}, 'LocationSignature': 'Udl'
}, {
    'Geometry': {'WGS84': {'east': 17.8992338732342, 'north': 59.5204849532449}}, 'LocationSignature': 'Upv'
}, {
    'Geometry': {'WGS84': {'east': 18.0112683523563, 'north': 59.278590231139}}, 'LocationSignature': 'Äs'
}, {
    'Geometry': {'WGS84': {'east': 17.5318845496334, 'north': 59.5694322754827}}, 'LocationSignature': 'Bål'
}, {
    'Geometry': {'WGS84': {'east': 17.31284113434, 'north': 59.0485492768045}}, 'LocationSignature': 'Gn'
}, {
    'Geometry': {'WGS84': {'east': 17.7870992091886, 'north': 59.7254088956277}}, 'LocationSignature': 'Kn'
}]
