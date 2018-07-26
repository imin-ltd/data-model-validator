const Rule = require('../rule');
const ValidationError = require('../../errors/validation-error');
const ValidationErrorType = require('../../errors/validation-error-type');
const ValidationErrorCategory = require('../../errors/validation-error-category');
const ValidationErrorSeverity = require('../../errors/validation-error-severity');

module.exports = class ConceptIdInSchemeRule extends Rule {
  constructor(options) {
    super(options);
    this.targetFields = { Concept: ['id', 'inScheme'] };
    this.description = 'Validates that both id and inScheme are set on Concept if one of them is set.';
  }

  validateField(node, field) {
    const otherField = field === 'id' ? 'inScheme' : 'id';
    const errors = [];

    if (typeof node.value[otherField] === 'undefined') {
      errors.push(
        new ValidationError(
          {
            category: ValidationErrorCategory.DATA_QUALITY,
            type: ValidationErrorType.CONCEPT_ID_AND_IN_SCHEME_TOGETHER,
            value: node.value[field],
            severity: ValidationErrorSeverity.WARNING,
            path: `${node.getPath()}.${field}`,
          },
        ),
      );
    }

    return errors;
  }
};