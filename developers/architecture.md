# Architecture

## Components

Application are separated by the following components...

- Controllers  
Controller is taking care of the business logic by get the data from the
adapters (model's implementations) and configurations. Controller will never connect to the actual datasources directly.
- Models  
Model is taking care of aqquiring data from various datasources.

### Controller

Controllers are defined in a way to easily import and decouple from all
dependencies. Each controller will be eagerly loaded with all dependencies
to improve response time (though this would trade with slower startup time).

### Model

Each model will implement to one specific implementation of one particular
datasource, with its own interface to manage the data. Though eventually,
all model would return a finalized data that gather from the datasource
regardless of the interface.

## Modules

Module are used for taking care of heavy-lifting tasks such as setting
dependencies, error handlings and connection between components.

### Controller
Controller is a module responsible for setup a business logic
(called controller's delegate) and dependency injections.

### Errors
Error module is responsible for properly convert an error into a proper HTTP
response. The module itself also provided a `HTTPError` class to be used for
response back an error for a particular request.
