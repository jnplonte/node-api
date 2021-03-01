export function autoFillPutInformation(data: object = {}, authData: object = {}): object {
	if (typeof authData['id'] !== 'undefined') {
		data['updatedUserId'] = authData['id'];
	}

	data['updatedAt'] = new Date();

	return data;
}

export function autoFillAllPutInformation(data: Array<object>, authData: object = {}): Array<object> {
	return data.map((dataval) => {
		if (typeof authData['id'] !== 'undefined') {
			dataval['updatedUserId'] = authData['id'];
		}

		dataval['updatedAt'] = new Date();

		return dataval;
	});
}
