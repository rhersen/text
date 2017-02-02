import {expect} from 'chai'

import getHtml from '../getHtml'

describe('getHtml', function () {
    it('returns empty div', function () {
        const actual = getHtml([])

        expect(actual).to.equal('<div id="sheet"><h1>undefined</h1></div>')
    })
})
