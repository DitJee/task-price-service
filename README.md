# Aggregated Crypto Price Service

## Overview

This service provides aggregated cryptocurrency price data by querying market data from multiple providers and returning a single reliable price data.

### Features:

- **Current price**: return the current price of the token.
- **Historical price**: return the price at a given point in time (up to 7 days). If a timestamp beyond 7 days is given, it will be clamped.
- **Multi-provider aggregation**: process market data from multiple providers and return reliable price data
- **Data staleness**: maximum data staleness of 1 minute

## API Endpoints

### Get current price

```
GET /price/{tokenSymbol}
```

### Get historical price

```
GET /price/historical/{tokenSymbol}?timestamp={epochUnixTimestamp}
```

## Architecture Overview

```
Controller: Input validation
   ↓
PriceService: Core business logics
   ↓
PriceSource: Handle each provider operations
   ↓
External APIs
```

At its core, [Bun](https://bun.com/docs/runtime) is chosen as the runtime of this service. It is designed to start fast and run fast, which is ideal for a service like ours.

For the program flow, the `Controller` acts as a handler, which is responsible for validating the input from the request. In this case, it just checks whether the given symbol is among those we support.

Next, the payload is forwarded to `PriceService`. It runs the core business logic of this service. This includes getting the current and historical price of the given cryptocurrency. The service runs multiple async tasks and waits for them to complete. Once they are done, the data are processed to eliminate potential outliers to increase the reliability of the return data (more on that later). To reduce the number of requests for the same symbol and timestamp, a simple key-value map cache is used here.

Lastly, `PriceSource` is used to handle all external provider interactions. Each provider has different schema and ways of requesting data. So, we have to individually handle each differently. This execution is simple. It is essentially just a simple fetch call to the endpoint.

## Outlier Rejection Strategy

Since we are working with data from multiple providers, there is always a chance for some of them to be inaccurate. So, we need to find a way to compensate for an error.

To do such a task, the a statistical filtering method, Interquartile Range (IQR), is applied to the queried data.

IQR is a robust way to detect and remove outliers based on the middle 50% of data.

- Q1 (25th percentile): lower quartile
- Q3 (75th percentile): upper quartile
- IQR = Q3 − Q1

Outlier rule:

- Lower bound = Q1 − 1.5 × IQR
- Upper bound = Q3 + 1.5 × IQR

Any data point outside these bounds is considered an outlier.

This method is chosen because of these traits:

- Resistant to extreme values
- Works well for skewed distributions
- Simple and distribution-free

## Caching Strategy

For now, a simple in-memory cache is used to:

- Enforce 1-minute staleness
- Reduce repeated external API calls
- Improve latency for hot symbols

Cache keys include:

- Symbol
- Timestamp (for historical queries)

## Tests

For simplicity, [bun test runner](https://bun.com/docs/test) is used to do unit testing. Currently, the test covers:

- Controller: price controller
- Service: price service
- Math: statistic operations

The test is triggered by running:

```bash
bun test
```

## Containerization

The service is designed to run inside Docker.
This allows easy deployment to cloud platforms or orchestration systems.

Since this is a simple service, a single `Dockerfile` is more than enough.
To run this service inside a container, build it as follows:

```bash
cd {repo_root}
docker build -t task-price-service .
```

Once the build is complete, run it using:

```bash
docker run -p 3000:3000 task-price-service
```

## GitHub Actions

A simple workflow is set up for this service CI, such that every time there is a push/merge into the `main` branch, the CI will be triggered. There are two stages: test and build.

### Test

In this stage, we verify the build by doing these checks:

1. Check repo
2. Setup Bun
3. Install dependencies
4. Type checking
5. Run unit tests

### Build

In this stage, we verify the build by doing these checks:

1. Check repo
2. Docker build

## Future Improvements

- Feature flag for different strategy
- Circuit breaker for failing providers
- Redis for distributed cache
- Rate limiting per API key
- Monitoring service
- Better log structure
