//
// *** adafruit_seesaw/adafruit_seesaw/seesaw.py ***
//

namespace seesaw {
    // cross compat helper
    // these types do not exist in micro:bit v0 (yet)
    class I2CDevice {
        public address: number;
        private _hasError: boolean;
        constructor(address: number) {
            this.address = address
        }
        public readInto(buf: Buffer, repeat = false, start = 0, end: number = null) {
            if (end === null)
                end = buf.length
            if (start >= end)
                return
            let res = pins.i2cReadBuffer(this.address, end - start, repeat)
            if (!res) {
                this._hasError = true
                return
            }
            buf.write(start, res)
        }
        public write(buf: Buffer, repeat = false) {
            // TODO: microbit v0 backward compat
            /* let res = */ pins.i2cWriteBuffer(this.address, buf, repeat)
            /*
            if (res) {
                this._hasError = true
            }*/
        }
        public begin(): I2CDevice {
            this._hasError = false;
            return this;
        }
        public end() {
        }
        public ok() {
            return !this._hasError
        }
    }

    function sizeOf(format: NumberFormat) {
        switch (format) {
            case NumberFormat.Int8LE:
            case NumberFormat.UInt8LE:
            case NumberFormat.Int8BE:
            case NumberFormat.UInt8BE:
                return 1;
            case NumberFormat.Int16LE:
            case NumberFormat.UInt16LE:
            case NumberFormat.Int16BE:
            case NumberFormat.UInt16BE:
                return 2;
            case NumberFormat.Int32LE:
            case NumberFormat.Int32BE:
            //case NumberFormat.UInt32BE:
            //case NumberFormat.UInt32LE:
            //case NumberFormat.Float32BE:
            //case NumberFormat.Float32LE:
                return 4;
            //case NumberFormat.Float64BE:
            //case NumberFormat.Float64LE:
            //    return 8;
        }
        return 0;
    }

    function createBufferFromArray(bytes: number[]) {
        let buf = pins.createBuffer(bytes.length)
        for (let i = 0; i < bytes.length; ++i)
            buf[i] = bytes[i]
        return buf
    }

    function getFormat(pychar: string, isBig: boolean) {
        switch (pychar) {
            case 'B':
                return NumberFormat.UInt8LE
            case 'b':
                return NumberFormat.Int8LE
            case 'H':
                return isBig ? NumberFormat.UInt16BE : NumberFormat.UInt16LE
            case 'h':
                return isBig ? NumberFormat.Int16BE : NumberFormat.Int16LE
            case 'I':
            //case 'L':
            //    return isBig ? NumberFormat.UInt32BE : NumberFormat.UInt32LE
            case 'i':
            case 'l':
                return isBig ? NumberFormat.Int32BE : NumberFormat.Int32LE
            //case 'f':
            //    return isBig ? NumberFormat.Float32BE : NumberFormat.Float32LE
            //case 'd':
            //    return isBig ? NumberFormat.Float64BE : NumberFormat.Float64LE
            default:
                return null as NumberFormat
        }
    }

    function packUnpackCore(format: string, nums: number[], buf: Buffer, isPack: boolean, off = 0) {
        let isBig = false
        let idx = 0
        for (let i = 0; i < format.length; ++i) {
            switch (format[i]) {
                case ' ':
                case '<':
                case '=':
                    isBig = false
                    break
                case '>':
                case '!':
                    isBig = true
                    break
                case 'x':
                    off++
                    break
                default:
                    let fmt = getFormat(format[i], isBig)
                    if (fmt === null) {
                        fail("Not supported format character: " + format[i])
                    } else {
                        if (buf) {
                            if (isPack)
                                buf.setNumber(fmt, off, nums[idx++])
                            else
                                nums.push(buf.getNumber(fmt, off))
                        }

                        off += pins.sizeOf(fmt)
                    }
                    break
            }
        }
        return off
    }

    function packedSize(format: string) {
        return packUnpackCore(format, null, null, true)
    }

    function packBuffer(format: string, nums: number[]) {
        let buf = pins.createBuffer(packedSize(format))
        packUnpackCore(format, nums, buf, true)
        return buf
    }

    function packIntoBuffer(format: string, buf: Buffer, offset: number, nums: number[]) {
        packUnpackCore(format, nums, buf, true, offset)
    }

    function unpackBuffer(format: string, buf: Buffer, offset = 0) {
        let res: number[] = []
        packUnpackCore(format, res, buf, false, offset)
        return res
    }

    function fail(msg: string) {
        // TODO: backward compat fail in microbit v0
        control.panic(108);
    }

    function pause(millis: number) {
        // TODO: backward compat pause in microbit v0
        basic.pause(millis);
    }

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
    /** 
`seesaw`
====================================================

An I2C to whatever helper chip.

* Author(s): Dean Miller

Implementation Notes
--------------------

**Hardware:**

* Adafruit `ATSAMD09 Breakout with seesaw
  <https://www.adafruit.com/product/3657>`_ (Product ID: 3657)

**Software and Dependencies:**

* Adafruit CircuitPython firmware for the ESP8622 and M0-based boards:
  https://github.com/adafruit/circuitpython/releases
* Adafruit's Bus Device library: https://github.com/adafruit/Adafruit_CircuitPython_BusDevice

 */
    const _STATUS_BASE = 0x00
    const _GPIO_BASE = 0x01
    const _SERCOM0_BASE = 0x02
    const _TIMER_BASE = 0x08
    const _ADC_BASE = 0x09
    const _DAC_BASE = 0x0A
    const _INTERRUPT_BASE = 0x0B
    const _DAP_BASE = 0x0C
    const _EEPROM_BASE = 0x0D
    const _NEOPIXEL_BASE = 0x0E
    const _TOUCH_BASE = 0x0F
    const _GPIO_DIRSET_BULK = 0x02
    const _GPIO_DIRCLR_BULK = 0x03
    const _GPIO_BULK = 0x04
    const _GPIO_BULK_SET = 0x05
    const _GPIO_BULK_CLR = 0x06
    const _GPIO_BULK_TOGGLE = 0x07
    const _GPIO_INTENSET = 0x08
    const _GPIO_INTENCLR = 0x09
    const _GPIO_INTFLAG = 0x0A
    const _GPIO_PULLENSET = 0x0B
    const _GPIO_PULLENCLR = 0x0C
    const _STATUS_HW_ID = 0x01
    const _STATUS_VERSION = 0x02
    const _STATUS_OPTIONS = 0x03
    const _STATUS_SWRST = 0x7F
    const _TIMER_STATUS = 0x00
    const _TIMER_PWM = 0x01
    const _TIMER_FREQ = 0x02
    const _ADC_STATUS = 0x00
    const _ADC_INTEN = 0x02
    const _ADC_INTENCLR = 0x03
    const _ADC_WINMODE = 0x04
    const _ADC_WINTHRESH = 0x05
    const _ADC_CHANNEL_OFFSET = 0x07
    const _SERCOM_STATUS = 0x00
    const _SERCOM_INTEN = 0x02
    const _SERCOM_INTENCLR = 0x03
    const _SERCOM_BAUD = 0x04
    const _SERCOM_DATA = 0x05
    const _NEOPIXEL_STATUS = 0x00
    const _NEOPIXEL_PIN = 0x01
    const _NEOPIXEL_SPEED = 0x02
    const _NEOPIXEL_BUF_LENGTH = 0x03
    const _NEOPIXEL_BUF = 0x04
    const _NEOPIXEL_SHOW = 0x05
    const _TOUCH_CHANNEL_OFFSET = 0x10
    const _HW_ID_CODE = 0x55
    const _EEPROM_I2C_ADDR = 0x3F

    export class SeesawPinmap {
        analogPins: number[]
        pwmWidth: number
        pwmPins: number[]
        touchPins: number[]
    }

    export class Seesaw {
        private i2c_device: I2CDevice;
        pinMapping: SeesawPinmap;
        /** Driver for Seesaw i2c generic conversion trip

       :param ~busio.I2C i2c_bus: Bus the SeeSaw is connected to
       :param int addr: I2C address of the SeeSaw device
 */
        static INPUT = 0x00
        static OUTPUT = 0x01
        static INPUT_PULLUP = 0x02
        static INPUT_PULLDOWN = 0x03

        constructor(pinmap: SeesawPinmap, addr: number = 0x49) {
            this.pinMapping = pinmap
            this.i2c_device = new I2CDevice(addr)
            this.softwareReset()
        }

        public softwareReset() {
            /** Trigger a software reset of the SeeSaw chip */
            this.write8(_STATUS_BASE, _STATUS_SWRST, 0xFF)
            pause(500)
            let chip_id = this.read8(_STATUS_BASE, _STATUS_HW_ID)
            if (chip_id != _HW_ID_CODE) {
                fail(`Seesaw hardware ID returned (${chip_id}) is not correct! Expected ${_HW_ID_CODE}. Please check your wiring.`)
            }
        }

        public getOptions(): number {
            let buf = pins.createBuffer(4)
            this.read(_STATUS_BASE, _STATUS_OPTIONS, buf)
            let ret = unpackBuffer(">I", buf)[0]
            return ret
        }

        public getVersion(): number {
            let buf = pins.createBuffer(4)
            this.read(_STATUS_BASE, _STATUS_VERSION, buf)
            let ret = unpackBuffer(">I", buf)[0]
            return ret
        }

        public pinMode(pin: number, mode: number) {
            if (pin >= 32) {
                this.pinModeBulkB(1 << pin - 32, mode)
            } else {
                this.pinModeBulk(1 << pin, mode)
            }

        }

        public digitalWrite(pin: number, value: boolean) {
            if (pin >= 32) {
                this.digitalWriteBulkB(1 << pin - 32, value)
            } else {
                this.digitalWriteBulk(1 << pin, value)
            }

        }

        public digitalRead(pin: number): boolean {
            if (pin >= 32) {
                return this.digitalReadBulkB(1 << pin - 32) != 0
            }

            return this.digitalReadBulk(1 << pin) != 0
        }

        public digitalReadBulk(pinSet: number): number {
            let buf = pins.createBuffer(4)
            this.read(_GPIO_BASE, _GPIO_BULK, buf)
            buf[0] = buf[0] & 0x3F
            let ret = unpackBuffer(">I", buf)[0]
            return ret & pinSet
        }

        public digitalReadBulkB(pinSet: number): number {
            let buf = pins.createBuffer(8)
            this.read(_GPIO_BASE, _GPIO_BULK, buf)
            let ret = unpackBuffer(">I", buf.slice(4))[0]
            return ret & pinSet
        }

        public setGPIOInterrupts(pinSet: number, enabled: boolean) {
            let cmd = packBuffer(">I", [pinSet])
            if (enabled) {
                this.write(_GPIO_BASE, _GPIO_INTENSET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_INTENCLR, cmd)
            }

        }

        public analogRead(pin: number): number {
            let buf = pins.createBuffer(2)
            if (this.pinMapping.analogPins.indexOf(pin) < 0) {
                fail("Invalid ADC pin")
            }

            this.read(_ADC_BASE, _ADC_CHANNEL_OFFSET + this.pinMapping.analogPins.indexOf(pin), buf)
            let ret = unpackBuffer(">H", buf)[0]
            pause(1)
            return ret
        }

        public touchRead(pin: number): number {
            let buf = pins.createBuffer(2)
            if (this.pinMapping.touchPins.indexOf(pin) < 0) {
                fail("Invalid touch pin")
            }

            this.read(_TOUCH_BASE, _TOUCH_CHANNEL_OFFSET + this.pinMapping.touchPins.indexOf(pin), buf)
            let ret = unpackBuffer(">H", buf)[0]
            return ret
        }

        public pinModeBulk(pinSet: number, mode: number) {
            let cmd = packBuffer(">I", [pinSet])
            if (mode == Seesaw.OUTPUT) {
                this.write(_GPIO_BASE, _GPIO_DIRSET_BULK, cmd)
            } else if (mode == Seesaw.INPUT) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
            } else if (mode == Seesaw.INPUT_PULLUP) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
                this.write(_GPIO_BASE, _GPIO_PULLENSET, cmd)
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            } else if (mode == Seesaw.INPUT_PULLDOWN) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
                this.write(_GPIO_BASE, _GPIO_PULLENSET, cmd)
                this.write(_GPIO_BASE, _GPIO_BULK_CLR, cmd)
            } else {
                fail("Invalid pin mode")
            }

        }

        public pinModeBulkB(pinSet: number, mode: number) {
            let cmd = pins.createBuffer(8)
            cmd.write(4, packBuffer(">I", [pinSet]))
            if (mode == Seesaw.OUTPUT) {
                this.write(_GPIO_BASE, _GPIO_DIRSET_BULK, cmd)
            } else if (mode == Seesaw.INPUT) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
            } else if (mode == Seesaw.INPUT_PULLUP) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
                this.write(_GPIO_BASE, _GPIO_PULLENSET, cmd)
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            } else if (mode == Seesaw.INPUT_PULLDOWN) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
                this.write(_GPIO_BASE, _GPIO_PULLENSET, cmd)
                this.write(_GPIO_BASE, _GPIO_BULK_CLR, cmd)
            } else {
                fail("Invalid pin mode")
            }

        }

        public digitalWriteBulk(pinSet: number, value: boolean) {
            let cmd = packBuffer(">I", [pinSet])
            if (value) {
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_BULK_CLR, cmd)
            }

        }

        public digitalWriteBulkB(pinSet: number, value: boolean) {
            let cmd = pins.createBuffer(8)
            cmd.write(4, packBuffer(">I", [pinSet]))
            if (value) {
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_BULK_CLR, cmd)
            }

        }

        public analogWrite(pin: number, value: number) {
            let pin_found = false
            let cmd = pins.createBuffer(3)

            if (this.pinMapping.pwmWidth == 16) {
                if (this.pinMapping.pwmPins.indexOf(pin) >= 0) {
                    pin_found = true
                    cmd = createBufferFromArray([this.pinMapping.pwmPins.indexOf(pin), value >> 8, value])
                }

            } else if (this.pinMapping.pwmPins.indexOf(pin) >= 0) {
                pin_found = true
                cmd = createBufferFromArray([this.pinMapping.pwmPins.indexOf(pin), value])
            }

            if (pin_found === false) {
                fail("Invalid PWM pin")
            }

            this.write(_TIMER_BASE, _TIMER_PWM, cmd)
        }

        public setPwmFreq(pin: number, freq: number) {
            if (this.pinMapping.pwmPins.indexOf(pin) >= 0) {
                let cmd = createBufferFromArray([this.pinMapping.pwmPins.indexOf(pin), freq >> 8, freq])
                this.write(_TIMER_BASE, _TIMER_FREQ, cmd)
            } else {
                fail("Invalid PWM pin")
            }

        }

        public eepromWrite8(addr: number, val: number) {
            this.eepromWrite(addr, createBufferFromArray([val]))
        }

        public eepromWrite(addr: number, buf: Buffer) {
            this.write(_EEPROM_BASE, addr, buf)
        }

        public eepromRead8(addr: number) {
            return this.read8(_EEPROM_BASE, addr)
        }

        public uartSetBaud(baud: number) {
            let cmd = packBuffer(">I", [baud])
            this.write(_SERCOM0_BASE, _SERCOM_BAUD, cmd)
        }

        public write8(reg_base: number, reg: number, value: number) {
            this.write(reg_base, reg, createBufferFromArray([value]))
        }

        public read8(reg_base: number, reg: number): number {
            let ret = pins.createBuffer(1)
            this.read(reg_base, reg, ret)
            return ret[0]
        }

        public read(reg_base: number, reg: number, buf: Buffer, delay: number = 1) {
            this.write(reg_base, reg, createBufferFromArray([]))
            pause(delay)

            {
                const i2c = this.i2c_device.begin()
                i2c.readInto(buf)
                i2c.end()
            }
        }

        public write(reg_base: number, reg: number, buf: Buffer) {
            let cmds = createBufferFromArray([reg_base, reg])
            let fullBuf = pins.createBuffer(2 + buf.length)
            fullBuf.write(0, cmds)
            fullBuf.write(2, buf)

            {
                const i2c = this.i2c_device.begin()
                i2c.write(fullBuf)
                i2c.end()
            }
        }

        public neopixelSendBuffer(pin: number, buffer: Buffer) {
            this.write(_NEOPIXEL_BASE, _NEOPIXEL_PIN, createBufferFromArray([pin]));   
            this.write(_NEOPIXEL_BASE, _NEOPIXEL_BUF_LENGTH, packBuffer(">H", [buffer.length]));        
            this.write(_NEOPIXEL_BASE, _NEOPIXEL_BUF, buffer);
            this.write(_NEOPIXEL_BASE, _NEOPIXEL_SHOW, pins.createBuffer(0));
        }
    }
}
