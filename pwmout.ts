//
// *** adafruit_seesaw/adafruit_seesaw/pwmout.py ***
//

namespace pwmout {
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
    // pylint: disable=missing-docstring,invalid-name,too-many-public-methods,too-few-public-methods
    let __version__ = "0.0.0-auto.0"
    let __repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_seesaw.git"
    export class PWMOut {
        _seesaw: Seesaw;
        _pin: int8;
        _dc: number
        _frequency: number
        /** A single seesaw channel that matches the :py:class:`~pulseio.PWMOut` API. */
        constructor(seesaw: Seesaw, pin: int8) {
            this._seesaw = seesaw
            this._pin = pin
            this._dc = 0
            this._frequency = 0
        }
        
        get frequency(): number {
            /** The overall PWM frequency in herz. */
            return this._frequency
        }
        
        set frequency(frequency: number) {
            this._seesaw.set_pwm_freq(this._pin, frequency)
            this._frequency = frequency
        }
        
        get duty_cycle(): number {
            /** 16 bit value that dictates how much of one cycle is high (1) versus low (0). 0xffff will
           always be high, 0 will always be low and 0x7fff will be half high and then half low.
 */
            return this._dc
        }
        
        set duty_cycle(value: number) {
            if (!(0 <= value && value <= 0xffff)) {
                control.fail("Out of range")
            }
            
            this._seesaw.analog_write(this._pin, value)
            this._dc = value
        }
        
    }
    
}
