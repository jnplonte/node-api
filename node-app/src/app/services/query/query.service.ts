import { Helper } from './../helper/helper.service';
import { Op } from 'sequelize';

export class Query {
	helper: Helper;

	constructor(private config) {
		this.helper = new Helper(this.config);
	}

	appendRequestOrder(orderData: Array<any> = [], reqOrder: string = ''): object {
		const reqOrderArray: Array<any> = reqOrder.split(':');
		const sorting: string = reqOrderArray[1] === 'ASC' || reqOrderArray[1] === 'DESC' ? reqOrderArray[1] : 'ASC';

		orderData.push([...reqOrderArray[0].split('.'), sorting]);

		return orderData;
	}

	getAll(model, data: Object = {}, reqQuery: Object = {}): Promise<any> {
		// if (Object.keys(reqQuery).length === 0) {
		//     return model.findAll(this.helper.cleanData(data)).then( (dataValue) => {
		//         return { 'data': dataValue || [], 'pagination': {} };
		//     });
		// }

		const page: number = typeof reqQuery['page'] !== 'undefined' ? reqQuery['page'] : 1;
		const limit: number =
			typeof reqQuery['limit'] !== 'undefined' ? Number(reqQuery['limit']) : Number(this.config.getQueryLimit);

		if (typeof reqQuery['query'] !== 'undefined') {
			data['where'] = this.appendRequestQuery(data['where'], reqQuery['query']);
		}

		if (typeof reqQuery['order'] !== 'undefined') {
			data['order'] = this.appendRequestOrder(data['order'], reqQuery['order']);
		}

		data['offset'] = limit * (page - 1);
		data['limit'] = limit;

		if (data['include']) {
			data['distinct'] = true;
		}

		return model.findAndCountAll(this.helper.cleanData(data)).then((dataValue) => {
			const allPagination: Object = {};

			allPagination['totalData'] = dataValue.count.length
				? Number(dataValue.count.length)
				: Number(dataValue.count || 0);
			allPagination['totalPage'] = Number(Math.ceil(allPagination['totalData'] / limit));
			allPagination['currentPage'] = Number(page);

			return { data: dataValue.rows || [], pagination: allPagination };
		});
	}

	getOne(model, data: Object = {}, reqKey: string, reqValue: string | number | boolean): Promise<any> {
		const whereData: Object = {};

		if (reqKey && reqValue) {
			whereData[reqKey] = reqValue;
		} else {
			whereData['id'] = reqValue;
		}

		data['where'] = Object.assign(whereData, data['where'] || {});

		return model.findOne(this.helper.cleanData(data));
	}

	post(model, data: Object = {}, include?: Object): Promise<any> {
		return model.create(this.helper.cleanDataWithNull(data), include ? include : {});
	}

	postBulk(model, data: Array<any> = [], include?: Object): Promise<any> {
		data = data.sort((a, b) => (!a.id ? -1 : !b.id ? 1 : 0));

		return model.bulkCreate(this.helper.cleanDataWithNull(data), include ? include : {});
	}

	postGet(model, data: Object = {}, getCreated?: boolean): Promise<any> {
		return model.findOrCreate({ where: this.helper.cleanDataWithNull(data) }).spread((modelData, created) => {
			if (typeof getCreated !== 'undefined') {
				return !getCreated ? modelData.get({ plain: true }) : modelData;
			} else {
				return modelData.get({ plain: true });
			}
		});
	}

	put(model, data: Object = {}, whereData: Object = {}): Promise<any> {
		return model.update(this.helper.cleanDataWithNull(data), whereData);
	}

	putGet(model, data: Object = {}, whereData: Object = {}): Promise<any> {
		const wData = this.helper.cleanData(whereData);
		const wDataNull = this.helper.cleanDataWithNull(data);

		return model.findOne(wData).then((modelData) => {
			if (!modelData) {
				return model.create(wDataNull);
			}

			return modelData.update(wDataNull, wData);
		});
	}

	putIncrement(model, data: Object = {}, whereData: Object = {}): Promise<any> {
		return model.increment(data, whereData);
	}

	putDecrement(model, data: Object = {}, whereData: Object = {}): Promise<any> {
		return model.decrement(data, whereData);
	}

	delete(model, data: Object = {}): Promise<any> {
		return model.destroy(this.helper.cleanData(data));
	}

	appendfilterQuery(reqFilter: string = ''): object {
		if (this.helper.isEmpty(reqFilter)) {
			return {};
		}

		const reqQueryArray: Array<any> = reqFilter.split('|');
		const finalQuery: Object = {};

		reqQueryArray.forEach((val: any) => {
			val = val.toString();
			if (val.indexOf('.') >= 1 && val.indexOf(':') >= 1) {
				const datavalArray: Array<any> = val.split(':');

				const keyValue = datavalArray[0] || '';

				let valValue = datavalArray[1] || '';
				let splitArray: Array<any> = valValue.split(',');
				if (splitArray.length > 1) {
					splitArray = splitArray.map((splitval) => (splitval === 'null' ? '' : splitval));
					valValue = { [Op.in]: splitArray };
				} else {
					if (valValue === 'null') {
						valValue = '';
					} else {
						valValue = this.helper.isInteger(valValue) ? valValue : { [Op.like]: '%' + valValue + '%' };
					}
				}

				const keyValueArray: Array<any> = keyValue.split('.');
				const keyValueFirst = keyValueArray[0].toString();
				keyValueArray.shift();
				const keyValueSecond = keyValueArray.join('.');

				if (finalQuery[keyValueFirst]) {
					finalQuery[keyValueFirst][this.getChildKey(keyValueSecond)] = valValue;
				} else {
					finalQuery[keyValueFirst] = {};
					finalQuery[keyValueFirst][this.getChildKey(keyValueSecond)] = valValue;
				}
			}
		});

		return finalQuery;
	}

	getChildKey(key: string = ''): string {
		if (key.indexOf('.') >= 1) {
			key = `$${key}$`;
		}

		return key;
	}

	private appendRequestQuery(whereData: Object = {}, reqQuery: string = ''): object {
		const reqQueryArray: Array<any> = reqQuery.split('|');
		const finalQuery: Object = {};

		reqQueryArray.forEach((val: any) => {
			const valArray: Array<any> = val.split(':');
			valArray[1] = valArray[1].toString();

			if (this.helper.isNotEmpty(valArray[0]) && valArray[1]) {
				let splitArray: Array<any> = valArray[1].split(',');
				if (splitArray.length > 1) {
					splitArray = splitArray.map((splitval) => (splitval === 'null' ? '' : splitval));
					finalQuery[this.getChildKey(valArray[0])] = { [Op.in]: splitArray };
				} else {
					if (valArray[1] === 'null') {
						finalQuery[this.getChildKey(valArray[0])] = '';
					} else {
						finalQuery[this.getChildKey(valArray[0])] = this.helper.isInteger(valArray[1])
							? valArray[1]
							: { [Op.like]: '%' + valArray[1] + '%' };
					}
				}
			}
		});

		return { ...whereData, ...finalQuery };
	}
}
