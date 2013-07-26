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

### Running the tests

To run the tests, open a shell in the project directory and execute:

``` sh
grunt
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

## License

The MIT License (MIT)

Copyright (c) 2013 Arthur Bogaart <spikylee@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.