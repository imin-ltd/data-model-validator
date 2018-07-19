const moment = require('moment');
const Rule = require('../rule');
const Field = require('../../classes/field');
const ValidationError = require('../../errors/validation-error');
const ValidationErrorType = require('../../errors/validation-error-type');
const ValidationErrorCategory = require('../../errors/validation-error-category');
const ValidationErrorSeverity = require('../../errors/validation-error-severity');

module.exports = class TimeFormatRule extends Rule {
  constructor(options) {
    super(options);
    this.targetFields = '*';
    this.description = 'Validates that Time fields are in the correct format.';
  }

  validateField(node, field) {
    const errors = [];
    let fieldObj;
    if (node.model.hasSpecification) {
      if (typeof (node.model.fields[field]) === 'undefined') {
        return [];
      }
      fieldObj = new Field(node.model.fields[field]);
    } else {
      fieldObj = new Field();
    }

    const type = fieldObj.detectType(node.value[field]);
    if (type === 'http://schema.org/Time'
        || fieldObj.isOnlyType('http://schema.org/Time')
    ) {
      if (!moment(node.value[field], ['HH:mm:ssZZ', 'HH:mmZZ'], true).isValid()) {
        errors.push(
          new ValidationError(
            {
              category: ValidationErrorCategory.CONFORMANCE,
              type: ValidationErrorType.INVALID_FORMAT,
              message: 'Times should be expressed as ISO 8601 format times with a trailing definition of timezone',
              value: node.value[field],
              severity: ValidationErrorSeverity.FAILURE,
              path: `${node.getPath()}.${field}`,
            },
          ),
        );
      }
    }
    return errors;
  }
};
