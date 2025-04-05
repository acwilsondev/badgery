# API Versioning

## Strategy

Badgery uses semantic versioning for its API:

- MAJOR version for breaking changes
- MINOR version for backward-compatible features
- PATCH version for backward-compatible fixes

## Version Header

API version is specified in the `Accept` header:

```
Accept: application/vnd.badgery.v1+json
```

## Deprecation

- Deprecated endpoints are marked with the `Deprecation` header
- Deprecation notices are included in response headers
- Deprecated features are removed only in major versions
