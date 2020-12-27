import { add } from './add';

describe('test', function () {
    test('add', function () {
        expect(add(1, 2))
            .toBe(3)
    })
})
