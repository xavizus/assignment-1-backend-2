const chai = require('chai')
const assert = chai.assert;

const {isEmpty} = require('../utilities/helperFunctions');

describe('helperFunctions', function () {
    describe('isEmpty', function () {
        it('should check if object, array and string is empty and return true', function () {
            let anObject = {};
            let anArray = [];
            let aString = '';
            let aNull = null;
            let anUndefined = undefined;

            assert.isTrue(isEmpty(anObject));
            assert.isTrue(isEmpty(anArray));
            assert.isTrue(isEmpty(aString));
            assert.isTrue(isEmpty(aNull));
            assert.isTrue(isEmpty(anUndefined));
        });
        it('should check if object, array and string is empty and return false', function () {
            let anObject = {isNotEmpty: true};
            let anArray = ['isNotEmpty'];
            let aString = 'NotEMPTY';

            assert.isFalse(isEmpty(anObject))
            assert.isFalse(isEmpty(anArray))
            assert.isFalse(isEmpty(aString))
        });
    });
});