const constraintsAuth = {

    fullName: {
        length: {
            minimum: 2,
            maximum: 60,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    phoneNumber: {
        length: {
            minimum: 11,
            maximum: 11,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    aboutUser: {
        length: {
            minimum: 10,
            maximum: 120,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    dateBirth: {
        presence: {
            allowEmpty: false,
        },

        type: "number",
    },

    firstName: {
        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    lastName: {
        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    username: {
        length: {
            minimum: 2,
            maximum: 20,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    emailAddress: {
        email: {
            message: "^E-mail address is invalid",
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    emailAddressConfirmation: {
        email: {
            message: "^E-mail address confirmation is invalid",
        },

        equality: {
            attribute: "emailAddress",
            message: "^E-mail address confirmation is not equal to e-mail address",
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    password: {
        length: {
            minimum: 6,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    passwordConfirmation: {
        equality: "password",

        length: {
            minimum: 6,
        },

        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    about: {
        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    education: {
        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    serviceCost: {
        presence: {
            allowEmpty: false,
        },

        type: "string",
    },

    getValidator: (fieldId) => {
        if (fieldId === "name" || fieldId === "description") {
            return {
                presence: {
                    allowEmpty: false,
                },

                type: "string",
            };
        } else if (fieldId === "price") {
            return {
                presence: {
                    allowEmpty: false,
                },

                type: "string",
            };
        }
    },
};

export default constraintsAuth;
