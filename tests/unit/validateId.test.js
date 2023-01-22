const validateId = require('../../libs/validateId');

describe('ObjectId validation', () => {
	it('should return true if id is valid objectId', () => {
		const result = validateId('6388cfbf34f198800e6be504');
		expect(result).toBe(true);
	});
	it('should return false if id is not valid objectId', () => {
		const result = validateId('123');
		expect(result).toBe(false);
	});
});
