

const ValidationErrorType = {
  INVALID_JSON: 'invalid_json',
  MISSING_REQUIRED_FIELD: 'missing_required_field',
  MISSING_RECOMMENDED_FIELD: 'missing_recommended_field',
  MODEL_NOT_FOUND: 'model_not_found',
  FIELD_NOT_IN_SPEC: 'field_not_in_spec',
  EXPERIMENTAL_FIELDS_NOT_CHECKED: 'experimental_fields_not_checked',
  INVALID_TYPE: 'invalid_type',
  INVALID_FORMAT: 'invalid_format',
  FIELD_IS_EMPTY: 'field_is_empty',
  FIELD_NOT_IN_DEFINED_VALUES: 'field_not_in_defined_values',
  START_DATE_AFTER_END_DATE: 'start_date_after_end_date',
  MIN_VALUE_GREATER_THAN_MAX_VALUE: 'min_value_greater_than_max_value',
  DATES_MUST_HAVE_DURATION: 'dates_must_have_duration',
  NO_ZERO_DURATION: 'no_zero_duration',
  CONSUMER_ASSUME_NO_GENDER_RESTRICTION: 'consumer_assume_no_gender_restriction',
};

module.exports = Object.freeze(ValidationErrorType);
