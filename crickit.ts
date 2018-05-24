//
// *** adafruit_seesaw/adafruit_seesaw/crickit.py ***
//

namespace crickit {
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
    const _ADC_INPUT_0_PIN_CRICKIT = 2
    const _ADC_INPUT_1_PIN_CRICKIT = 3
    const _ADC_INPUT_2_PIN_CRICKIT = 40
    const _ADC_INPUT_3_PIN_CRICKIT = 41
    const _ADC_INPUT_4_PIN_CRICKIT = 11
    const _ADC_INPUT_5_PIN_CRICKIT = 10
    const _ADC_INPUT_6_PIN_CRICKIT = 9
    const _ADC_INPUT_7_PIN_CRICKIT = 8
    const _CRICKIT_S4 = 14
    const _CRICKIT_S3 = 15
    const _CRICKIT_S2 = 16
    const _CRICKIT_S1 = 17
    const _CRICKIT_M1_A1 = 18
    const _CRICKIT_M1_A2 = 19
    const _CRICKIT_M1_B1 = 22
    const _CRICKIT_M1_B2 = 23
    const _CRICKIT_DRIVE1 = 42
    const _CRICKIT_DRIVE2 = 43
    const _CRICKIT_DRIVE3 = 12
    const _CRICKIT_DRIVE4 = 13
    const _CRICKIT_CT1 = 0
    const _CRICKIT_CT2 = 1
    const _CRICKIT_CT3 = 2
    const _CRICKIT_CT4 = 3
    export class Crickit_Pinmap extends Seesaw_Pinmap {
        static analog_pins = [_ADC_INPUT_0_PIN_CRICKIT, _ADC_INPUT_1_PIN_CRICKIT, _ADC_INPUT_2_PIN_CRICKIT, _ADC_INPUT_3_PIN_CRICKIT, _ADC_INPUT_4_PIN_CRICKIT, _ADC_INPUT_5_PIN_CRICKIT, _ADC_INPUT_6_PIN_CRICKIT, _ADC_INPUT_7_PIN_CRICKIT]
        static pwm_width = 16
        static pwm_pins = [_CRICKIT_S4, _CRICKIT_S3, _CRICKIT_S2, _CRICKIT_S1, _CRICKIT_M1_A1, _CRICKIT_M1_A2, _CRICKIT_M1_B1, _CRICKIT_M1_B2, _CRICKIT_DRIVE1, _CRICKIT_DRIVE2, _CRICKIT_DRIVE3, _CRICKIT_DRIVE4]
        static touch_pins = [_CRICKIT_CT1, _CRICKIT_CT2, _CRICKIT_CT3, _CRICKIT_CT4]
    }
    
}
