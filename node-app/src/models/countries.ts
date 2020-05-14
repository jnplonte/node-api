import {
    Sequelize
} from 'sequelize';

export interface CountriesAttributes {
    id ?: string;
    createdAt ?: Date;
    updatedAt ?: Date;

    code ?: string;
    name ?: string;
    description ?: string;
    default ?: boolean;
    active ?: boolean;
}

export default function(sequelize: Sequelize, dataTypes: any) {
    const countries = sequelize.define('countries', {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        code: dataTypes.STRING,
        name: dataTypes.STRING,
        description: dataTypes.STRING,
        default: dataTypes.BOOLEAN,
        active: dataTypes.BOOLEAN
    });

    return countries;
}
