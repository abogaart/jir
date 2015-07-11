[![Build Status](https://img.shields.io/travis/abogaart/jir.svg?style=flat-square)](http://travis-ci.org/abogaart/jir)
[![Coverage Status](https://img.shields.io/coveralls/abogaart/jir.svg?style=flat-square)](https://coveralls.io/r/abogaart/jir)
[![David](https://img.shields.io/david/abogaart/jir.svg?style=flat-square)]()
[![License](https://img.shields.io/github/license/abogaart/jir.svg?style=flat-square)]()

# Jir

Bring Hippo assistance to the command line.

## Installation

Install the packages using NPM

``` sh
npm install
```

## Usage

### Running with no arguments

Running without any arguments gives an overview of the available options.

``` sh
jir
```

### Running with arguments

``` sh
jir archetype latest
```

## Developer information

### The Javascript code style is enforced with JSCS and linted with JSHint
* http://jscs.info/rules.html
* http://jshint.com/docs


### Running the tests

To run the tests, open a shell in the project directory and execute:

``` sh
grunt test
```

### Running in debug mode

To start Jir in debug mode, simply set the environment variable JIR_DEBUG to true, like:

 ``` sh
 export JIR_DEBUG=true
 ```

 To run in normal mode again use:

 ``` sh
 export JIR_DEBUG=
 ```

### Use development-mode configuration from ./config/jir-config-dev.json
``` sh
 export JIR_DEVMODE=true
 ```



## License

MIT