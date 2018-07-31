

const ValidationErrorType = require('./validation-error-type');

const ValidationErrorMessage = {
  [ValidationErrorType.INVALID_JSON]: 'The JSON fragment supplied is invalid.',
  [ValidationErrorType.MISSING_REQUIRED_FIELD]: 'Required field is missing.',
  [ValidationErrorType.MISSING_RECOMMENDED_FIELD]: 'Recommended field is missing.',
  [ValidationErrorType.MODEL_NOT_FOUND]: 'Could not load definition for model',
  [ValidationErrorType.FILE_NOT_FOUND]: 'Could not load file (not found)',
  [ValidationErrorType.FIELD_NOT_IN_SPEC]: 'This field is not defined in the specification',
  [ValidationErrorType.FIELD_COULD_BE_TYPO]: 'This field is not defined in the specification, but could be a typo',
  [ValidationErrorType.EXPERIMENTAL_FIELDS_NOT_CHECKED]: 'The validator does not currently check experimental fields',
  [ValidationErrorType.UNSUPPORTED_VALUE]: 'The value you have provided is not supported by the validator',
  [ValidationErrorType.INVALID_TYPE]: 'Field is an invalid type',
  [ValidationErrorType.INVALID_FLEXIBLE_TYPE]: 'Field is an invalid type',
  [ValidationErrorType.INVALID_FORMAT]: 'Field is not in the correct format',
  [ValidationErrorType.NO_HTML]: 'HTML should be stripped from all data before publishing',
  [ValidationErrorType.INVALID_PRECISION]: 'Field is not provided to the correct level of precision',
  [ValidationErrorType.FIELD_IS_EMPTY]: 'Field is not allowed to be empty',
  [ValidationErrorType.FIELD_NOT_IN_DEFINED_VALUES]: 'This value supplied is not in the allowed values for this field',
  [ValidationErrorType.START_DATE_AFTER_END_DATE]: 'Start date is after the end date of the event',
  [ValidationErrorType.MIN_VALUE_GREATER_THAN_MAX_VALUE]: 'minValue must not be greater than maxValue',
  [ValidationErrorType.DATES_MUST_HAVE_DURATION]: 'A duration must be provided when a start date and end date are set',
  [ValidationErrorType.NO_ZERO_DURATION]: 'Zero durations are not allowed',
  [ValidationErrorType.CONSUMER_ASSUME_NO_GENDER_RESTRICTION]: 'Data consumers will assume that there is no gender restriction',
  [ValidationErrorType.CONSUMER_ASSUME_AGE_RANGE]: 'Data consumers will assume the age range is 18+ if not specified, no minimum age if no minValue is specified, no maximum age if no maxValue is specified and suitable for all if minValue is 0 and no maxValue is specified',
  [ValidationErrorType.CONSUMER_ASSUME_EVENT_STATUS]: 'Data consumers will assume the event status is scheduled if not specified or invalid',
  [ValidationErrorType.ACTIVITY_NOT_IN_ACTIVITY_LIST]: 'Activities should use values from the OpenActive activity list',
  [ValidationErrorType.MISSING_IS_ACCESSIBLE_FOR_FREE]: 'Activities with a zero price offer should have isAccessibleForFree set to true',
  [ValidationErrorType.ADDRESS_HAS_TRAILING_COMMA]: 'Address fields should not have a trailing comma',
  [ValidationErrorType.CONCEPT_ID_AND_IN_SCHEME_TOGETHER]: 'If one of \'id\' or \'inScheme\' are set on a Concept, the other should be set too',
  [ValidationErrorType.SCHEMA_ORG_FIELDS_NOT_CHECKED]: 'This field is declared in schema.org but this validator is not yet capable of checking whether they have the right format or values. You should refer to the schema.org documentation for additional guidance',
};

module.exports = ValidationErrorMessage;
