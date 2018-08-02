const moment = require('moment');
const Rule = require('../rule');
const Field = require('../../classes/field');
const ValidationErrorType = require('../../errors/validation-error-type');
const ValidationErrorCategory = require('../../errors/validation-error-category');
const ValidationErrorSeverity = require('../../errors/validation-error-severity');

module.exports = class TimeFormatRule extends Rule {
  constructor(options) {
    super(options);
    this.targetFields = '*';
    this.meta = {
      name: 'TimeFormatRule',
      description: 'Validates that Time fields are in the correct format.',
      tests: {
        default: {
          message: 'Times should be expressed as ISO 8601 format times with a trailing definition of timezone. For example, 12:00Z or 13:00+01:00.',
          category: ValidationErrorCategory.CONFORMANCE,
          severity: ValidationErrorSeverity.FAILURE,
          type: ValidationErrorType.INVALID_FORMAT,
        },
      },
    };
  }

  validateField(node, field) {
    const errors = [];
    let fieldObj;
    if (node.model.hasSpecification) {
      fieldObj = node.model.getField(field);
      if (typeof fieldObj === 'undefined') {
        return [];
      }
    } else {
      fieldObj = new Field();
    }

    const type = fieldObj.detectType(node.value[field]);
    if (type === 'http://schema.org/Time'
        || fieldObj.isOnlyType('http://schema.org/Time')
    ) {
      if (!moment(node.value[field], ['HH:mm:ssZZ', 'HH:mmZZ'], true).isValid()) {
        errors.push(
          this.createError(
            'default',
            {
              value: node.value[field],
              path: node.getPath(field),
            },
          ),
        );
      }
    }
    return errors;
  }
};
