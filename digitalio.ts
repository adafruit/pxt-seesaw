//
// *** adafruit_seesaw/adafruit_seesaw/digitalio.py ***
//

namespace digitalio {
    // The MIT License (MIT)
    // Copyright (c) 2017 Dean Miller for Adafruit Industries
    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:
    // The above copyright notice and this permission notice shall be included in
    // all copies or substantial portions of the Software.
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    // THE SOFTWARE.
    // pylint: disable=missing-docstring,invalid-name,too-many-public-methods
    let __version__ = "0.0.0-auto.0"
    let __repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_seesaw.git"

    declare const enum DriveMode {
        PUSH_PULL = 1
    }

    declare const enum Pull {
        UP = 1,
        DOWN = 2
    }

    declare const enum Direction {
        INPUT = 0,
        OUTPUT = 1
    }

    export class DigitalIO {
        _seesaw: Seesaw;
        _pin: int8;
        _drive_mode: DriveMode;
        _direction: Direction
        _pull: uint8;
        _value: boolean
        constructor(seesaw: Seesaw, pin: int8) {
            this._seesaw = seesaw
            this._pin = pin
            this._drive_mode = DriveMode.PUSH_PULL
            this._direction = Direction.INPUT
            this._pull = null
            this._value = false
        }
        
        public deinit() {
            ;
        }
        
        public switch_to_output(value: boolean = false, drive_mode: DriveMode = DriveMode.PUSH_PULL) {
            this._seesaw.pin_mode(this._pin, this._seesaw.OUTPUT)
            this._seesaw.digital_write(this._pin, value)
            this._drive_mode = drive_mode
            this._pull = null
        }
        
        public switch_to_input(pull: Pull = null) {
            if (pull == Pull.DOWN) {
                control.fail("Pull Down currently not supported")
            } else if (pull == Pull.UP) {
                this._seesaw.pin_mode(this._pin, this._seesaw.INPUT_PULLUP)
            } else {
                this._seesaw.pin_mode(this._pin, this._seesaw.INPUT)
            }
            
            this._pull = pull
        }
        
        get direction(): Direction {
            return this._direction
        }
        
        set direction(value: Direction) {
            if (value == Direction.OUTPUT) {
                this.switch_to_output()
            } else if (value == Direction.INPUT) {
                this.switch_to_input()
            } else {
                control.fail("Out of range")
            }
            
            this._direction = value
        }
        
        get value(): boolean {
            if (this._direction == Direction.OUTPUT) {
                return this._value
            }
            
            return this._seesaw.digital_read(this._pin)
        }
        
        set value(val: boolean) {
            this._seesaw.digital_write(this._pin, val)
            this._value = val
        }
        
        get drive_mode(): uint8 {
            return this._drive_mode
        }
        
        set drive_mode(mode: uint8) {
            ;
        }
        
        get pull(): uint8 {
            return this._pull
        }
        
        set pull(mode: uint8) {
            if (this._direction == Direction.OUTPUT) {
                control.fail("cannot set pull on an output pin")
            } else if (mode == Pull.DOWN) {
                control.fail("Pull Down currently not supported")
            } else if (mode == Pull.UP) {
                this._seesaw.pin_mode(this._pin, this._seesaw.INPUT_PULLUP)
            } else if (mode === null) {
                this._seesaw.pin_mode(this._pin, this._seesaw.INPUT)
            } else {
                control.fail("Out of range")
            }
            
        }
        
    }
    
}
