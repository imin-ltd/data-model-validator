const validate = require('./validate');
const ValidationErrorSeverity = require('./errors/validation-error-severity');
const ValidationErrorType = require('./errors/validation-error-type');

describe('validate', function() {
    it('should return a failure if passed an invalid model', function() {
        let data = {};

        let result = validate(data, 'InvalidModel');

        expect(result.length).toBe(1);
        expect(result[0].type).toBe(ValidationErrorType.MODEL_NOT_FOUND);
        expect(result[0].severity).toBe(ValidationErrorSeverity.WARNING);
    });

    it('should return a warning if an array is passed to validate', function() {
        let data = [];

        let result = validate(data);

        expect(result.length).toBe(1);
        expect(result[0].type).toBe(ValidationErrorType.INVALID_JSON);
        expect(result[0].severity).toBe(ValidationErrorSeverity.WARNING);
    });

    it('should return a failure if a non-object is passed to validate', function() {
        let data = "bad_data";

        let result = validate(data);

        expect(result.length).toBe(1);
        expect(result[0].type).toBe(ValidationErrorType.INVALID_JSON);
        expect(result[0].severity).toBe(ValidationErrorSeverity.FAILURE);
    });

    it('should return no errors for a valid Event', function() {
        let event = {
            "@context": "https://www.openactive.io/ns/oa.jsonld",
            "type": "Event",
            "name": "Tai chi Class",
            "description": "A Tai chi class",
            "duration": "PT1H",
            "url": "http://www.example.org/events/1",
            "startDate": "2017-03-22T20:00:00Z",
            "activity": "Tai Chi",
            "eventStatus": "http://schema.org/EventScheduled",
            "organizer": {
                "type": "Organization",
                "name": "Example Co",
                "url": "http://www.example.org",
                "email": "hello@example.org",
                "logo": "http://www.example.org/logo.png",
                "sameAs": [
                    "http://www.facebook.com/example-org"
                ]
            },
            "location": {
                "type": "Place",
                "name": "ExampleCo Gym",
                "url": "http://www.example.org/locations/gym",
                "address": {
                    "type": "PostalAddress",
                    "streetAddress": "1 High Street",
                    "addressLocality": "Bristol",
                    "addressRegion": "Bristol",
                    "addressCountry": "GB",
                    "postalCode": "BS1 4SD"
                },
                "geo": {
                    "latitude": 51.4034423828125,
                    "longitude": -0.2369088977575302,
                    "type": "GeoCoordinates"
                },
            }
        };

        let result = validate(event);

        expect(result.length).toBe(0);
    });

    it('should provide a jsonpath to the location of a problem', function() {
        // This event is missing location addressRegion, which is a recommended field
        let event = {
            "@context": "https://www.openactive.io/ns/oa.jsonld",
            "type": "Event",
            "name": "Tai chi Class",
            "description": "A Tai chi class",
            "duration": "PT1H",
            "url": "http://www.example.org/events/1",
            "startDate": "2017-03-22T20:00:00Z",
            "activity": "Tai Chi",
            "eventStatus": "http://schema.org/EventScheduled",
            "organizer": {
                "type": "Organization",
                "name": "Example Co",
                "url": "http://www.example.org",
                "email": "hello@example.org",
                "logo": "http://www.example.org/logo.png",
                "sameAs": [
                    "http://www.facebook.com/example-org"
                ]
            },
            "location": {
                "type": "Place",
                "name": "ExampleCo Gym",
                "url": "http://www.example.org/locations/gym",
                "address": {
                    "type": "PostalAddress",
                    "streetAddress": "1 High Street",
                    "addressLocality": "Bristol",
                    "addressCountry": "GB",
                    "postalCode": "BS1 4SD"
                },
                "geo": {
                    "latitude": 51.4034423828125,
                    "longitude": -0.2369088977575302,
                    "type": "GeoCoordinates"
                },
            }
        };

        let result = validate(event);

        expect(result.length).toBe(1);

        expect(result[0].path).toBe('$.location.address.addressRegion');
    });

    it('should check submodels of a model even if we don\'t know what type it is', function() {
        let data = {
            "type": "UnknownType",
            "geo": {
                "latitude": 51.4034423828125,
                "type": "GeoCoordinates"
            },
            "location": {
                "type": "SafariPark"
            }
        };

        let result = validate(data);

        expect(result.length).toBe(3);

        expect(result[0].type).toBe(ValidationErrorType.MODEL_NOT_FOUND);
        expect(result[0].severity).toBe(ValidationErrorSeverity.WARNING);
        expect(result[0].path).toBe('$');

        expect(result[1].type).toBe(ValidationErrorType.MISSING_REQUIRED_FIELD);
        expect(result[1].severity).toBe(ValidationErrorSeverity.FAILURE);
        expect(result[1].path).toBe('$.geo.longitude');

        expect(result[2].type).toBe(ValidationErrorType.MODEL_NOT_FOUND);
        expect(result[2].severity).toBe(ValidationErrorSeverity.WARNING);
        expect(result[2].path).toBe('$.location');
    });
});