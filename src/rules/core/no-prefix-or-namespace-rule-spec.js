const NoPrefixOrNamespaceRule = require('./no-prefix-or-namespace-rule');
const Model = require('../../classes/model');
const ModelNode = require('../../classes/model-node');
const ValidationErrorType = require('../../errors/validation-error-type');
const ValidationErrorSeverity = require('../../errors/validation-error-severity');

describe('NoPrefixOrNamespaceRule', () => {
  const model = new Model({
    type: 'Event',
    hasId: true,
    idFormat: 'http://schema.org/url',
    inSpec: [
      '@context',
      'id',
      'type',
      'name',
      'ageRange',
    ],
  });
  model.hasSpecification = true;

  const rule = new NoPrefixOrNamespaceRule();

  it('should target fields of any type', () => {
    const isTargeted = rule.isFieldTargeted(model, 'type');
    expect(isTargeted).toBe(true);
  });

  it('should return no errors if all fields are non-prefixed', () => {
    const data = {
      type: 'Event',
      name: 'An Event',
    };

    const nodeToTest = new ModelNode(
      '$',
      data,
      null,
      model,
    );
    const errors = rule.validate(nodeToTest);

    expect(errors.length).toBe(0);
  });

  it('should return no errors if all prefixed or namespaced fields are extensions', () => {
    const data = {
      type: 'Event',
      'ext:testField': 'An extension field',
      'http://ext.example.org/anotherTestField': 'Another extension field',
    };

    const nodeToTest = new ModelNode(
      '$',
      data,
      null,
      model,
    );
    const errors = rule.validate(nodeToTest);

    expect(errors.length).toBe(0);
  });

  it('should return a warning if @type or @id are used', () => {
    const data = {
      '@type': 'Event',
      '@id': 'http://example.org/event/1',
    };

    const nodeToTest = new ModelNode(
      '$',
      data,
      null,
      model,
    );
    const errors = rule.validate(nodeToTest);

    expect(errors.length).toBe(2);

    for (const error of errors) {
      expect(error.type).toBe(ValidationErrorType.USE_FIELD_ALIASES);
      expect(error.severity).toBe(ValidationErrorSeverity.WARNING);
    }
  });
  it('should return a warning if prefixed fields with aliases are used', () => {
    const data = {
      type: 'Event',
      id: 'http://example.org/event/1',
      'schema:name': 'Event Name',
      'oa:ageRange': {
        type: 'QuantitativeValue',
        minValue: 0,
      },
    };

    const nodeToTest = new ModelNode(
      '$',
      data,
      null,
      model,
    );
    const errors = rule.validate(nodeToTest);

    expect(errors.length).toBe(2);

    for (const error of errors) {
      expect(error.type).toBe(ValidationErrorType.USE_FIELD_ALIASES);
      expect(error.severity).toBe(ValidationErrorSeverity.WARNING);
    }
  });
  it('should return a warning if prefixed fields with namespaces are used', () => {
    const data = {
      type: 'Event',
      id: 'http://example.org/event/1',
      'http://schema.org/name': 'Event Name',
      'https://www.openactive.org/ns#ageRange': {
        type: 'QuantitativeValue',
        minValue: 0,
      },
    };

    const nodeToTest = new ModelNode(
      '$',
      data,
      null,
      model,
    );
    const errors = rule.validate(nodeToTest);

    expect(errors.length).toBe(2);

    for (const error of errors) {
      expect(error.type).toBe(ValidationErrorType.USE_FIELD_ALIASES);
      expect(error.severity).toBe(ValidationErrorSeverity.WARNING);
    }
  });
});