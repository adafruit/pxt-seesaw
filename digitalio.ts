//
// *** adafruit_seesaw/adafruit_seesaw/digitalio.py ***
//

namespace seesaw {
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
        _pin: number;
        _drive_mode: DriveMode;
        _direction: Direction
        _pull: number;
        _value: boolean
        constructor(seesaw: Seesaw, pin: number) {
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
        
        public switchToOutput(value: boolean = false, drive_mode: DriveMode = DriveMode.PUSH_PULL) {
            this._seesaw.pinMode(this._pin, Seesaw.OUTPUT)
            this._seesaw.digitalWrite(this._pin, value)
            this._drive_mode = drive_mode
            this._pull = null
        }
        
        public switchToInput(pull: Pull = null) {
            if (pull == Pull.DOWN) {
                control.fail("Pull Down currently not supported")
            } else if (pull == Pull.UP) {
                this._seesaw.pinMode(this._pin, Seesaw.INPUT_PULLUP)
            } else {
                this._seesaw.pinMode(this._pin, Seesaw.INPUT)
            }
            
            this._pull = pull
        }
        
        get direction(): Direction {
            return this._direction
        }
        
        set direction(value: Direction) {
            if (value == Direction.OUTPUT) {
                this.switchToOutput()
            } else if (value == Direction.INPUT) {
                this.switchToInput()
            } else {
                control.fail("Out of range")
            }
            
            this._direction = value
        }
        
        get value(): boolean {
            if (this._direction == Direction.OUTPUT) {
                return this._value
            }
            
            return this._seesaw.digitalRead(this._pin)
        }
        
        set value(val: boolean) {
            this._seesaw.digitalWrite(this._pin, val)
            this._value = val
        }
        
        get drive_mode(): number {
            return this._drive_mode
        }
        
        set drive_mode(mode: number) {
            ;
        }
        
        get pull(): number {
            return this._pull
        }
        
        set pull(mode: number) {
            if (this._direction == Direction.OUTPUT) {
                control.fail("cannot set pull on an output pin")
            } else if (mode == Pull.DOWN) {
                control.fail("Pull Down currently not supported")
            } else if (mode == Pull.UP) {
                this._seesaw.pinMode(this._pin, Seesaw.INPUT_PULLUP)
            } else if (mode === null) {
                this._seesaw.pinMode(this._pin, Seesaw.INPUT)
            } else {
                control.fail("Out of range")
            }
            
        }
        
    }
    
}
