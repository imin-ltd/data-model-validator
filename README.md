# OpenActive Data Model Validator

The OpenActive data model validator library.

[![Build Status](https://travis-ci.org/openactive/data-model-validator.svg?branch=master)](https://travis-ci.org/openactive/data-model-validator)
[![Known Vulnerabilities](https://snyk.io/test/github/openactive/data-model-validator/badge.svg)](https://snyk.io/test/github/openactive/data-model-validator)

## Introduction

This library allows developers to validate JSON models to the latest [OpenActive Modelling Opportunity Data](https://www.openactive.io/modelling-opportunity-data/) specification.

## Example

```js

const Validator = require('openactive-data-model-validator');

const model = {
  '@context': 'https://www.openactive.io/ns/oa.jsonld',
  type: 'Event',
  name: 'Tai chi Class',
  url: 'http://www.example.org/events/1',
  startDate: '2017-03-22T20:00:00',
  activity: 'Tai Chi',
  location: {
    type: 'Place',
    name: 'ExampleCo Gym',
    address: {
      type: 'PostalAddress',
      streetAddress: '1 High Street',
      addressLocality: 'Bristol',
      postalCode: 'BS1 4SD'
    }
  }
};

// Check whether the JSON conforms to the Event model
const result = Validator.validate(model);

// Returns:
// [{category: 'conformance', type: 'missing_required_field', message: 'Required field is missing.', value: undefined, severity: 'failure', path: '$.context' }, ... ]

```

### Options

The `validate` method optionally accepts options for validation:

#### activityLists

An array of activity lists in `skos:ConceptScheme` format. For example, see https://www.openactive.io/activity-list/activity-list.jsonld

e.g.

```js

const model = {
  // ...
};

const options = {
  activityLists: [
    {
      '@context': 'https://www.openactive.io/ns/oa.jsonld',
      '@id': 'http://openactive.io/activity-list/',
      title: 'OpenActive Activity List',
      description: 'This document describes the OpenActive standard activity list.',
      type: 'skos:ConceptScheme',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      concepts: [
        {
          id: 'http://openactive.io/activity-list/#c16df6ed-a4a0-4275-a8c3-1c8cff56856f',
          type: 'skos:Concept',
          prefLabel: 'Tai Chi',
          'skos:definition': 'Tai chi combines deep breathing and relaxation with slow and gentle movements.',
          broader: 'http://openactive.io/activity-list/#594e5805-3a5c-4c60-80fc-c0a28eb64a06',
        },
        // ...
      ],
    },
  ]
};

const result = Validator.validate(model, options);
```

#### type

The validator will detect the type of the model being validated from the `type` property. You can override this by providing a type option.

e.g.

```js

const model = {
  type: 'CustomAction'
  // ...
};

const options = {
  type: 'Action'
};

const result = Validator.validate(model, options);
```

## Development

### Getting started

```shell
$ git clone git@github.com:openactive/data-model-validator.git
$ cd data-model-validator
$ npm install
```
### Running tests

This project uses [Jasmine 1.3](https://jasmine.github.io/) for its tests via [jasmine-node](https://github.com/mhevery/jasmine-node). All spec files are located alongside the files that they target.

To run tests, run:

```shell
$ npm test
```

### Adding rules

To add a new rule, you will need to extend the `Rule` class, following these rules:

* Set `this.targetModels` to an array of the names of model you are targeting, or a string `'*'` wildcard.
* Optionally set `this.targetFields` to an object map of the fields you are targeting in each model, or a string `'*''` wildcard. Setting the property to `null` means that the rule will be applied once to the whole model.
* Set `this.description` to explain what the rule is testing for.
* If just targeting models, implement `validateModel`.
* If targeting specific fields, implement `validateField`.
* Write a test for your rule.
* Add the rule to the list in `rules/index`, so that it is processed.

#### Rule targeting

There is a lot of flexibility in the way that you can target rules.

To target all models at the top level:

```js
this.targetModels = '*';
```

To target all fields in every model:

```js
this.targetFields = '*';
```

To target specific models at the top level:

```js
this.targetModels = ['Event', 'Place'];
```

To target specific fields in specific models:

```js
this.targetFields = {
    'Event': [
        'startDate',
        'endDate'
    ],
    'Place': [
        'url'
    ]
};
```

#### Example

```js
const Rule = require('../rule');
const ValidationError = require('../../validation-error');

module.exports = class RequiredFieldsRule extends Rule {
    
  constructor(options) {
    super(options);
    this.targetModels = '*';
    this.description = 'Validates that all required fields are present in the JSON data.';
  }
    
  validateModel(node) {
    let errors = [];
    for (let field of node.model.requiredFields) {
      if (typeof(node.value[field]) === 'undefined'
        || node.value[field] === null
      ) {
        errors.push(
          new ValidationError(
            {
              category: 'conformance',
              type: 'missing_required_field',
              value: undefined,
              severity: 'failure',
              path: `${node.getPath()}.${field}`
            }
          )
        );
      }
    }
    return errors;
  }
}
```
