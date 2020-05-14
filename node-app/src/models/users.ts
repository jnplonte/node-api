import {
    Sequelize
} from 'sequelize';

const encodeKeyInformation = (data) => {
    if (data['phone']) {
        data['phone'] = Buffer.from(data['phone']).toString('base64');
    }

    if (data['email']) {
        data['email'] = Buffer.from(data['email']).toString('base64');
    }

    return data;
};
const decodeKeyInformation = (data) => {
    if (data['phone']) {
        data['phone'] = Buffer.from(data['phone'], 'base64').toString('ascii');
    }

    if (data['email']) {
        data['email'] = Buffer.from(data['email'], 'base64').toString('ascii');
    }

    return data;
};

export interface UsersAttributes {
    id ?: string;
    createdUserId ?: string;
    createdAt ?: Date;
    updatedUserId ?: string;
    updatedAt ?: Date;

    firstName ?: string;
    lastName ?: string;
    email ?: string;
    phone ?: string;
    username ?: string;
    password ?: string;
    salt ?: string;
    forgotPasswordKey ?: string;
    lastLogin ?: Date;
    loginCount ?: number;
    roleId ?: number;
    languageId ?: number;
    countryId ?: number;
    socialMedia ?: string;
    socialMediaKey ?: string;
    active ?: boolean;
    verified ?: boolean;
    verificationKey ?: string;

    loginAttempt ?: number;
    passwordExpiry ?: Date;
}

export default function(sequelize: Sequelize, dataTypes: any) {
    const users = sequelize.define('users', {
        id: {
            type: dataTypes.UUID,
            primaryKey: true,
            defaultValue: dataTypes.UUIDV4
        },
        firstName: dataTypes.STRING,
        lastName: dataTypes.STRING,
        email: {
            type: dataTypes.STRING,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        phone: dataTypes.STRING,
        username: {
            type: dataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: dataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        salt: dataTypes.STRING,
        forgotPasswordKey: dataTypes.STRING,
        lastLogin: dataTypes.DATE,
        loginCount: dataTypes.INTEGER,
        roleId: {
            type: dataTypes.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        languageId: {
            type: dataTypes.INTEGER,
            references: {
                model: 'languages',
                key: 'id'
            }
        },
        countryId: {
            type: dataTypes.INTEGER,
            references: {
                model: 'countries',
                key: 'id'
            }
        },
        socialMedia: {
            type: dataTypes.ENUM,
            values: ['NONE', 'FACEBOOK']
        },
        socialMediaKey: dataTypes.STRING,
        active: dataTypes.BOOLEAN,

        verified: dataTypes.BOOLEAN,
        verificationKey: dataTypes.STRING,

        loginAttempt: dataTypes.TINYINT,
        passwordExpiry: dataTypes.DATE,

        createdUserId: dataTypes.UUID,
        updatedUserId: dataTypes.UUID
    },
    {
        hooks: {
            beforeBulkCreate: (data: any) => {
                if (data) {
                    data = encodeKeyInformation(data);
                }
            },
            beforeCreate: (data: any) => {
                if (data) {
                    data = encodeKeyInformation(data);
                }
            },
            beforeBulkUpdate: (data: any) => {
                if (data && typeof(data['attributes']) !== 'undefined') {
                    data['attributes'] = encodeKeyInformation(data['attributes']);
                }
            },
            beforeUpdate: (data: any) => {
                if (data && typeof(data['attributes']) !== 'undefined') {
                    data['attributes'] = encodeKeyInformation(data['attributes']);
                }
            },
            afterFind: (data: any) => {
                if (data) {
                    if (data.constructor.name === 'Array') {
                        data = data.map( (dataval) => {
                            dataval = decodeKeyInformation(dataval);
                            return dataval;
                        });
                    } else {
                        data = decodeKeyInformation(data);
                    }
                }
            }
        }
    });

    users['associate'] = (models) => {
        models.users.belongsTo(models.roles, {
            foreignKey: 'roleId'
        });

        models.users.belongsTo(models.languages, {
            foreignKey: 'languageId'
        });

        models.users.belongsTo(models.countries, {
            foreignKey: 'countryId'
        });
    };

    return users;
}
