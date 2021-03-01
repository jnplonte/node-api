export function autoFillPostInformation(data: object = {}, authData: object = {}): object {
	if (typeof authData['id'] !== 'undefined') {
		data['createdUserId'] = authData['id'];
		data['updatedUserId'] = authData['id'];
	}

	data['createdAt'] = new Date();
	data['updatedAt'] = new Date();

	return data;
}

export function autoFillAllPostInformation(data: Array<object>, authData: object = {}): Array<object> {
	return data.map((dataval) => {
		if (typeof authData['id'] !== 'undefined') {
			dataval['createdUserId'] = authData['id'];
			dataval['updatedUserId'] = authData['id'];
		}

		dataval['createdAt'] = new Date();
		dataval['updatedAt'] = new Date();

		return dataval;
	});
}
