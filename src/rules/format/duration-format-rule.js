const Rule = require('../rule');
const Field = require('../../classes/field');
const ValidationErrorType = require('../../errors/validation-error-type');
const ValidationErrorCategory = require('../../errors/validation-error-category');
const ValidationErrorSeverity = require('../../errors/validation-error-severity');

module.exports = class DurationFormatRule extends Rule {
  constructor(options) {
    super(options);
    this.targetFields = '*';
    this.meta = {
      name: 'DurationFormatRule',
      description: 'Validates that duration fields are in the correct format.',
      tests: {
        default: {
          message: 'Durations should be expressed as ISO 8601 durations. For example, P1D, PT1H or PT1H30M.',
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

    // See https://en.wikipedia.org/wiki/ISO_8601
    // NOTE: moment should not be used to validate durations, it is
    // too lenient - it allows time components without the T, and
    // fractions of units all the way through the string, and allows
    // the character 'P'
    const durationRegex = new RegExp(
      '^P('
      + '('
        // Necessary, because each final term in the string can be a fraction
        + '([0-9]+Y)?([0-9]+M)?([0-9]+D)?T([0-9]+H)?([0-9]+M)?([0-9]+(?:[,\\.][0-9]+)?S)'
        + '|([0-9]+Y)?([0-9]+M)?([0-9]+D)?T([0-9]+H)?([0-9]+(?:[,\\.][0-9]+)?M)'
        + '|([0-9]+Y)?([0-9]+M)?([0-9]+D)?T([0-9]+(?:[,\\.][0-9]+)?H)'
        + '|([0-9]+Y)?([0-9]+M)?([0-9]+(?:[,\\.][0-9]+)?D)'
        + '|([0-9]+Y)?([0-9]+(?:[,\\.][0-9]+)?M)'
        + '|([0-9]+(?:[,\\.][0-9]+)?Y)'
      + ')'
      + '|([0-9]+W)'
      + ')$',
    );

    const type = fieldObj.detectType(node.value[field]);
    if (type === 'http://schema.org/Duration'
        || fieldObj.isOnlyType('http://schema.org/Duration')
    ) {
      if (!durationRegex.test(node.value[field])) {
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
