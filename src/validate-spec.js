const { validate } = require('./validate');
const ValidationErrorSeverity = require('./errors/validation-error-severity');
const ValidationErrorType = require('./errors/validation-error-type');
const DataModelHelper = require('./helpers/data-model');
const OptionsHelper = require('./helpers/options');
const JsonLoaderHelper = require('./helpers/json-loader');

describe('validate', () => {
  let validEvent;
  let options;
  let activityList;
  let metaData;
  beforeEach(() => {
    metaData = DataModelHelper.getMetaData('latest');
    validEvent = {
      '@context': metaData.contextUrl,
      id: 'http://www.example.org/events/1',
      type: 'EventSeries',
      name: 'Tai chi Class',
      description: 'A Tai chi class',
      duration: 'PT1H',
      url: 'http://www.example.org/events/1',
      startDate: '2017-03-22T20:00:00Z',
      ageRange: {
        type: 'QuantitativeValue',
        minValue: 18,
        maxValue: 60,
      },
      genderRestriction: 'https://openactive.io/NoRestriction',
      activity: [
        {
          id: 'https://openactive.io/activity-list/#c16df6ed-a4a0-4275-a8c3-1c8cff56856f',
          prefLabel: 'Tai Chi',
          type: 'Concept',
          inScheme: 'https://openactive.io/activity-list',
        },
      ],
      category: [
        {
          id: 'https://openactive.io/activity-list/#594e5805-3a5c-4c60-80fc-c0a28eb64a06',
          prefLabel: 'Holistic Classes',
          type: 'Concept',
          inScheme: 'https://openactive.io/activity-list',
        },
      ],
      eventStatus: 'https://schema.org/EventScheduled',
      image: [{
        type: 'ImageObject',
        url: 'http://www.example.org/logo.png',
      }],
      subEvent: [
        {
          type: 'Event',
          id: 'http://www.example.org/events/12',
          url: 'http://www.example.org/events/12',
          startDate: '2017-03-22T20:00:00Z',
          endDate: '2017-03-22T21:00:00Z',
          offers: [{
            id: 'http://example.org/offer/1',
            ageRange: {
              type: 'QuantitativeValue',
              minValue: 18,
              maxValue: 65,
            },
            url: 'http://example.org/offer/1',
            type: 'Offer',
            name: 'Single session',
            price: 5,
            priceCurrency: 'GBP',
          }],
        },
        {
          type: 'ScheduledSession',
          id: 'http://www.example.org/events/13',
          url: 'http://www.example.org/events/13',
          startDate: '2017-03-29T20:00:00Z',
          endDate: '2017-03-29T21:00:00Z',
          offers: [{
            id: 'http://example.org/offer/1',
            ageRange: {
              type: 'QuantitativeValue',
              minValue: 18,
              maxValue: 65,
            },
            url: 'http://example.org/offer/1',
            type: 'Offer',
            name: 'Single session',
            price: 5,
            priceCurrency: 'GBP',
          }],
        },
      ],
      organizer: {
        id: 'http://www.example.org',
        type: 'Organization',
        name: 'Example Co',
        url: 'http://www.example.org',
        description: 'Example organizer',
        telephone: '01234567890',
        sameAs: [
          'http://www.example.org/facebook',
        ],
        logo: {
          type: 'ImageObject',
          url: 'http://www.example.org/logo.png',
        },
      },
      leader: [{
        id: 'http://www.example.org/person/1',
        type: 'Person',
        name: 'Joe Bloggs',
      }],
      level: [
        'Beginner',
      ],
      location: {
        id: 'http://www.example.org/locations/gym',
        type: 'Place',
        name: 'ExampleCo Gym',
        description: 'ExampleCo\'s main gym',
        image: [{
          type: 'ImageObject',
          url: 'http://www.example.org/gym.png',
        }],
        url: 'http://www.example.org/locations/gym',
        address: {
          type: 'PostalAddress',
          streetAddress: '1 High Street',
          addressLocality: 'Bristol',
          addressRegion: 'Bristol',
          addressCountry: 'GB',
          postalCode: 'BS1 4SD',
        },
        telephone: '0845000000',
        geo: {
          latitude: 51.4034423828125,
          longitude: -0.2369088977575302,
          type: 'GeoCoordinates',
        },
        openingHoursSpecification: [{
          type: 'OpeningHoursSpecification',
          opens: '07:00',
          closes: '21:00',
          dayOfWeek: 'https://schema.org/Monday',
        }],
        amenityFeature: [
          {
            name: 'Changing Facilities',
            value: true,
            type: 'ChangingFacilities',
          },
        ],
      },
      offers: [{
        id: 'http://example.org/offer/1',
        ageRange: {
          type: 'QuantitativeValue',
          minValue: 18,
          maxValue: 65,
        },
        url: 'http://example.org/offer/1',
        type: 'Offer',
        name: 'Single session',
        price: 5,
        priceCurrency: 'GBP',
      }],
      maximumAttendeeCapacity: 20,
      remainingAttendeeCapacity: 10,
    };
    activityList = {
      '@context': 'https://openactive.io/',
      '@id': 'https://openactive.io/activity-list',
      title: 'OpenActive Activity List',
      description: 'This document describes the OpenActive standard activity list.',
      type: 'skos:ConceptScheme',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      concepts: [
        {
          id: 'https://openactive.io/activity-list/#c16df6ed-a4a0-4275-a8c3-1c8cff56856f',
          type: 'skos:Concept',
          prefLabel: 'Tai Chi',
          'skos:definition': 'Tai chi combines deep breathing and relaxation with slow and gentle movements.',
          broader: 'https://openactive.io/activity-list/#594e5805-3a5c-4c60-80fc-c0a28eb64a06',
        },
      ],
    };

    spyOn(JsonLoaderHelper, 'getFile').and.callFake(url => ({
      errorCode: JsonLoaderHelper.ERROR_NONE,
      statusCode: 200,
      data: activityList,
      url,
      exception: null,
      contentType: 'application/json',
      fetchTime: (new Date()).valueOf(),
    }));

    options = new OptionsHelper({
      loadRemoteJson: true,
      version: 'latest',
    });
  });

  it('should return a failure if passed an invalid model', () => {
    const data = {};

    const result = validate(data, new OptionsHelper({ type: 'InvalidModel' }));

    expect(result.length).toBe(2);
    expect(result[0].type).toBe(ValidationErrorType.MISSING_REQUIRED_FIELD);
    expect(result[0].severity).toBe(ValidationErrorSeverity.FAILURE);

    expect(result[1].type).toBe(ValidationErrorType.MISSING_REQUIRED_FIELD);
    expect(result[1].severity).toBe(ValidationErrorSeverity.FAILURE);
  });

  it('should not throw if no type is passed', () => {
    const data = {};

    validate(data);

    const validateFunc = () => { validate(data); };

    expect(validateFunc).not.toThrow();
  });

  it('should return a warning if an array is passed to validate', () => {
    const data = [];

    const result = validate(data, options);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe(ValidationErrorType.INVALID_JSON);
    expect(result[0].severity).toBe(ValidationErrorSeverity.WARNING);
  });

  it('should return a failure if a non-object is passed to validate', () => {
    const data = 'bad_data';

    const result = validate(data, options);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe(ValidationErrorType.INVALID_JSON);
    expect(result[0].severity).toBe(ValidationErrorSeverity.FAILURE);
  });

  it('should return no errors for a valid Event', () => {
    const event = Object.assign({}, validEvent);

    const result = validate(event, options);

    expect(result.length).toBe(0);
  });

  it('should only return alias warnings for a valid Event with aliased properties', () => {
    const event = Object.assign(
      {},
      validEvent,
      {
        '@type': 'EventSeries',
        'schema:name': validEvent.name,
        'oa:ageRange': Object.assign({}, validEvent.ageRange),
      },
    );

    delete event.type;
    delete event.name;
    delete event.ageRange;

    const result = validate(event, options);

    expect(result.length).toBe(3);

    for (const error of result) {
      expect(error.type).toBe(ValidationErrorType.USE_FIELD_ALIASES);
      expect(error.severity).toBe(ValidationErrorSeverity.WARNING);
    }
  });

  it('should provide a jsonpath to the location of a problem', () => {
    // This event is missing location addressRegion, which is a recommended field
    const event = Object.assign({}, validEvent);

    delete event.location.address.addressRegion;

    const result = validate(event, options);

    expect(result.length).toBe(1);

    expect(result[0].path).toBe('$.location.address.addressRegion');
  });

  it('should provide a jsonpath to the location of a problem with a namespace', () => {
    const event = Object.assign(
      {},
      validEvent,
      {
        'https://openactive.io/ageRange': {
          type: 'QuantitativeValue',
          minValue: 60,
          maxValue: 18,
        },
      },
    );

    delete event.ageRange;

    const result = validate(event, options);

    expect(result.length).toBe(2);

    expect(result[0].path).toBe('$["https://openactive.io/ageRange"]');
    expect(result[1].path).toBe('$["https://openactive.io/ageRange"].minValue');
  });

  it('should check submodels of a model even if we don\'t know what type it is', () => {
    const data = {
      type: 'UnknownType',
      geo: {
        latitude: 51.4034423828125,
        type: 'GeoCoordinates',
      },
      location: {
        type: 'SafariPark',
      },
    };

    const result = validate(data, options);

    expect(result.length).toBe(4);

    expect(result[0].type).toBe(ValidationErrorType.EXPERIMENTAL_FIELDS_NOT_CHECKED);
    expect(result[0].severity).toBe(ValidationErrorSeverity.SUGGESTION);
    expect(result[0].path).toBe('$');

    expect(result[1].type).toBe(ValidationErrorType.MISSING_REQUIRED_FIELD);
    expect(result[1].severity).toBe(ValidationErrorSeverity.FAILURE);
    expect(result[1].path).toBe('$["@context"]');

    expect(result[2].type).toBe(ValidationErrorType.MISSING_REQUIRED_FIELD);
    expect(result[2].severity).toBe(ValidationErrorSeverity.FAILURE);
    expect(result[2].path).toBe('$.geo.longitude');

    expect(result[3].type).toBe(ValidationErrorType.EXPERIMENTAL_FIELDS_NOT_CHECKED);
    expect(result[3].severity).toBe(ValidationErrorSeverity.SUGGESTION);
    expect(result[3].path).toBe('$.location');
  });

  it('should cope with flexible model types', () => {
    const place = {
      '@context': metaData.contextUrl,
      id: 'http://www.example.org/locations/gym',
      type: 'Place',
      name: 'ExampleCo Gym',
      description: 'ExampleCo\'s main gym',
      image: [{
        type: 'ImageObject',
        url: 'http://www.example.org/gym.png',
      }],
      url: 'http://www.example.org/locations/gym',
      address: {
        type: 'PostalAddress',
        streetAddress: '1 High Street',
        addressLocality: 'Bristol',
        addressRegion: 'Bristol',
        addressCountry: 'GB',
        postalCode: 'BS1 4SD',
      },
      telephone: '0845000000',
      geo: {
        latitude: 51.4034423828125,
        longitude: -0.2369088977575302,
        type: 'GeoCoordinates',
      },
      openingHoursSpecification: [{
        type: 'OpeningHoursSpecification',
        opens: '07:00',
        closes: '21:00',
        dayOfWeek: 'https://schema.org/Monday',
      }],
      amenityFeature: [
        {
          name: 'Changing Facilities',
          value: true,
          type: 'ChangingFacilities',
        },
        {
          name: 'My Place',
          value: true,
          type: 'ext:MyPlace',
        },
      ],
    };

    const result = validate(place, options);

    expect(result.length).toBe(1);

    expect(result[0].type).toBe(ValidationErrorType.EXPERIMENTAL_FIELDS_NOT_CHECKED);
    expect(result[0].severity).toBe(ValidationErrorSeverity.SUGGESTION);
    expect(result[0].path).toBe('$.amenityFeature[1]');
  });

  it('should cope with arrays of flexible model types mixed with invalid elements', () => {
    const place = {
      '@context': metaData.contextUrl,
      id: 'http://www.example.org/locations/gym',
      type: 'Place',
      name: 'ExampleCo Gym',
      description: 'ExampleCo\'s main gym',
      image: [{
        type: 'ImageObject',
        url: 'http://www.example.org/gym.png',
      }],
      url: 'http://www.example.org/locations/gym',
      address: {
        type: 'PostalAddress',
        streetAddress: '1 High Street',
        addressLocality: 'Bristol',
        addressRegion: 'Bristol',
        addressCountry: 'GB',
        postalCode: 'BS1 4SD',
      },
      telephone: '0845000000',
      geo: {
        latitude: 51.4034423828125,
        longitude: -0.2369088977575302,
        type: 'GeoCoordinates',
      },
      openingHoursSpecification: [{
        type: 'OpeningHoursSpecification',
        opens: '07:00',
        closes: '21:00',
        dayOfWeek: 'https://schema.org/Monday',
      }],
      amenityFeature: [
        {
          name: 'Changing Facilities',
          value: true,
          type: 'ChangingRooms',
        },
        'An invalid array element',
        {
          name: 'My Place',
          value: true,
          type: 'ext:MyPlace',
        },
      ],
    };

    const result = validate(place, options);

    expect(result.length).toBe(2);

    expect(result[0].type).toBe(ValidationErrorType.INVALID_TYPE);
    expect(result[0].severity).toBe(ValidationErrorSeverity.FAILURE);
    expect(result[0].path).toBe('$.amenityFeature');

    expect(result[1].type).toBe(ValidationErrorType.EXPERIMENTAL_FIELDS_NOT_CHECKED);
    expect(result[1].severity).toBe(ValidationErrorSeverity.SUGGESTION);
    expect(result[1].path).toBe('$.amenityFeature[2]');
  });

  it('should not throw if a property of value null is passed', () => {
    const data = {
      '@context': metaData.contextUrl,
      type: 'Event',
      'beta:distance': null,
    };

    let result;

    const doValidate = () => {
      result = validate(data, options);
    };

    expect(doValidate).not.toThrow();
    expect(typeof result).toBe('object');
  });

  it('should not throw if a property of value null is passed', () => {
    const data = {
      '@context': metaData.contextUrl,
      type: 'Event',
      category: [null, null],
    };

    let result;

    const doValidate = () => {
      result = validate(data, options);
    };

    expect(doValidate).not.toThrow();
    expect(typeof result).toBe('object');
  });

  it('should return an unsupported warning if nested arrays are passed', () => {
    const event = Object.assign({}, validEvent);

    event.leader = [event.leader];

    const result = validate(event, options);

    expect(result.length).toBe(1);

    expect(result[0].type).toBe(ValidationErrorType.INVALID_TYPE);
    expect(result[0].severity).toBe(ValidationErrorSeverity.FAILURE);
    expect(result[0].path).toBe('$.leader');
  });

  it('should not throw if a value object is passed', () => {
    const event = Object.assign({}, validEvent);

    event.name = {
      '@value': event.name,
    };

    let result;
    const doValidate = () => {
      result = validate(event, options);
    };

    expect(doValidate).not.toThrow();

    expect(result.length).toBe(1);

    expect(result[0].type).toBe(ValidationErrorType.UNSUPPORTED_VALUE);
    expect(result[0].severity).toBe(ValidationErrorSeverity.FAILURE);
    expect(result[0].path).toBe('$.name');
  });

  it('should recognise an RPDE feed', () => {
    const feed = {
      items: [
        {
          id: 'ABCDEF09001015',
          kind: 'session',
          state: 'updated',
          data: validEvent,
          modified: 1533177378657,
        },
      ],
      next: 'https://example.org/api/feed/?afterId=ABCDEF09001015&afterTimestamp=1533206202992&limit=500',
      license: 'https://creativecommons.org/licenses/by/4.0/',
    };

    const result = validate(feed, options);

    expect(result.length).toBe(1);
    expect(result[0].type).toBe(ValidationErrorType.FOUND_RPDE_FEED);
    expect(result[0].severity).toBe(ValidationErrorSeverity.NOTICE);
  });
});
