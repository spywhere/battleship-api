# Architecture

## Components

Application are separated by the following components...

- Adapters  
Adapter is taking care of the data from various datasources, with support for
mock data in testing.
- Controllers  
Controller is taking care of the business logic by get the data from the
adapters and configurations. Controller will never connect to the actual
datasources directly.
- Routes  
Route is taking care of linking between API interfaces and controllers
through the module called `link` in `common` directory.

### Adapter

Adapter will directly inherit from BaseAdapter, where it managed a connection
between controller and datasource.

Each adapter will implement to one specific implementation of particular
datasource, with its own interface to manage the data. Though eventually,
all adapter would return a finalized data that gather from the datasource
regardless of the interface.

### Controller

Controllers are defined in a way to easily import and decouple from all
dependencies. Each controller will be eagerly loaded with all dependencies
to improve response time (though this would trade with slower startup time).

### Route

Route is a very basic routing from HTTP request to the controller, by using
`link` module to manage a request and response data to / from the controller.

## Modules

Module are used for taking care of heavy-lifting tasks such as setting
dependencies, data abstraction and connection between components.

### Link
Link is a module responsible for managing data from HTTP request, transform it
into an abstract version of the request. Making it easier to add or change
support for various interfaces.

### Controller
Controller is a module responsible for managing dependencies, controller will
control a setup of the business logic (called controller's delegate),
dependencies as well as any middleware it may have, for app-wide
request / response manupulations.

### Config
Config module is responsible for loading configurations from file, as well as
caching it. It also loading configuration by environment.

### Loader
Loader is a module responsible for loading another module, mainly figuring out
where the module is, and load it.
