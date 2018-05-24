//
// *** adafruit_seesaw/adafruit_seesaw/seesaw.py ***
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
    // This code needs to be broken up into analogio, busio, digitalio, and pulseio
    // compatible classes so we won't bother with some lints until then.
    // pylint: disable=missing-docstring,invalid-name,too-many-public-methods,no-name-in-module
    try {
    }
    catch (_/* instanceof ImportError */) {
    }
    
    let __version__ = "0.0.0-auto.0"
    let __repo__ = "https://github.com/adafruit/Adafruit_CircuitPython_seesaw.git"
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
    // TODO: update when we get real PID
    const _CRICKIT_PID = 9999
    export class Seesaw {
        _drdy: int8;
        private i2c_device: pins.I2CDevice;
        pin_mapping: Seesaw_Pinmap;
        /** Driver for Seesaw i2c generic conversion trip

       :param ~busio.I2C i2c_bus: Bus the SeeSaw is connected to
       :param int addr: I2C address of the SeeSaw device
 */
        static INPUT = 0x00
        static OUTPUT = 0x01
        static INPUT_PULLUP = 0x02
        static INPUT_PULLDOWN = 0x03

        constructor(addr: number = 0x49, drdy: int8 = -1) {
            this._drdy = drdy
            if (drdy != -1) {
                drdy.switch_to_input()
            }

            this.i2c_device = new pins.I2CDevice(addr)
            this.softwareReset()
        }
        
        public softwareReset() {
            /** Trigger a software reset of the SeeSaw chip */
            this.write8(_STATUS_BASE, _STATUS_SWRST, 0xFF)
            pause(500)
            let chip_id = this.read8(_STATUS_BASE, _STATUS_HW_ID)
            if (chip_id != _HW_ID_CODE) {
                control.fail(`Seesaw hardware ID returned (${chip_id}) is not correct! Expected ${_HW_ID_CODE}. Please check your wiring.`)
            }
            
            let pid = this.get_version() >> 16
            if (pid == _CRICKIT_PID) {
                this.pin_mapping = adafruit_seesaw.crickit.Crickit_Pinmap
            } else {
                this.pin_mapping = adafruit_seesaw.samd09.SAMD09_Pinmap
            }
            
        }
        
        public get_options(): number {
            let buf = pins.createBuffer(4)
            this.read(_STATUS_BASE, _STATUS_OPTIONS, buf)
            let ret = pins.unpackBuffer(">I", buf)[0]
            return ret
        }
        
        public get_version(): number {
            let buf = pins.createBuffer(4)
            this.read(_STATUS_BASE, _STATUS_VERSION, buf)
            let ret = pins.unpackBuffer(">I", buf)[0]
            return ret
        }
        
        public pin_mode(pin: number, mode: number) {
            if (pin >= 32) {
                this.pin_mode_bulk_b(1 << pin - 32, mode)
            } else {
                this.pin_mode_bulk(1 << pin, mode)
            }
            
        }
        
        public digital_write(pin: number, value: number) {
            if (pin >= 32) {
                this.digital_write_bulk_b(1 << pin - 32, value)
            } else {
                this.digital_write_bulk(1 << pin, value)
            }
            
        }
        
        public digital_read(pin: number): boolean {
            if (pin >= 32) {
                return this.digital_read_bulk_b(1 << pin - 32) != 0
            }
            
            return this.digital_read_bulk(1 << pin) != 0
        }
        
        public digital_read_bulk(pinSet: number): number {
            let buf = pins.createBuffer(4)
            this.read(_GPIO_BASE, _GPIO_BULK, buf)
            buf[0] = buf[0] & 0x3F
            let ret = pins.unpackBuffer(">I", buf)[0]
            return ret & pinSet
        }
        
        public digital_read_bulk_b(pinSet: number): number {
            let buf = pins.createBuffer(8)
            this.read(_GPIO_BASE, _GPIO_BULK, buf)
            let ret = pins.unpackBuffer(">I", buf.slice(4))[0]
            return ret & pinSet
        }
        
        public set_GPIO_interrupts(pinSet: number, enabled: boolean) {
            let cmd = pins.packBuffer(">I", pinSet)
            if (enabled) {
                this.write(_GPIO_BASE, _GPIO_INTENSET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_INTENCLR, cmd)
            }
            
        }
        
        public analog_read(pin: number): number {
            let buf = pins.createBuffer(2)
            if (this.pin_mapping.analog_pins.indexOf(pin) < 0) {
                control.fail("Invalid ADC pin")
            }
            
            this.read(_ADC_BASE, _ADC_CHANNEL_OFFSET + this.pin_mapping.analog_pins.index(pin), buf)
            let ret = pins.unpackBuffer(">H", buf)[0]
            pause(1)
            return ret
        }
        
        public touch_read(pin: number): number {
            let buf = pins.createBuffer(2)
            if (this.pin_mapping.touch_pins.indexOf(pin) < 0) {
                control.fail("Invalid touch pin")
            }
            
            this.read(_TOUCH_BASE, _TOUCH_CHANNEL_OFFSET + this.pin_mapping.touch_pins.index(pin), buf)
            let ret = pins.unpackBuffer(">H", buf)[0]
            return ret
        }
        
        public pin_mode_bulk(pinSet: number, mode: number) {
            let cmd = pins.packBuffer(">I", pinSet)
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
                control.fail("Invalid pin mode")
            }
            
        }
        
        public pin_mode_bulk_b(pinSet: number, mode: number) {
            let cmd = pins.createBuffer(8)
            cmd.slice(4) = pins.packBuffer(">I", pinSet)
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
                control.fail("Invalid pin mode")
            }
            
        }
        
        public digital_write_bulk(pinSet: number, value: number) {
            let cmd = pins.packBuffer(">I", pinSet)
            if (value) {
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_BULK_CLR, cmd)
            }
            
        }
        
        public digital_write_bulk_b(pinSet: number, value: number) {
            let cmd = pins.createBuffer(8)
            cmd.slice(4) = pins.packBuffer(">I", pinSet)
            if (value) {
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_BULK_CLR, cmd)
            }
            
        }
        
        public analog_write(pin: number, value: number) {
            let pin_found = false
            if (this.pin_mapping.pwm_width == 16) {
                if (this.pin_mapping.pwm_pins.indexOf(pin) >= 0) {
                    pin_found = true
                    let cmd = pins.createBuffer([this.pin_mapping.pwm_pins.index(pin), value >> 8, value])
                }
                
            } else if (this.pin_mapping.pwm_pins.indexOf(pin) >= 0) {
                pin_found = true
                cmd = pins.createBuffer([this.pin_mapping.pwm_pins.index(pin), value])
            }
            
            if (pin_found === false) {
                control.fail("Invalid PWM pin")
            }
            
            this.write(_TIMER_BASE, _TIMER_PWM, cmd)
        }
        
        public set_pwm_freq(pin: number, freq: number) {
            if (this.pin_mapping.pwm_pins.indexOf(pin) >= 0) {
                let cmd = pins.createBuffer([this.pin_mapping.pwm_pins.index(pin), freq >> 8, freq])
                this.write(_TIMER_BASE, _TIMER_FREQ, cmd)
            } else {
                control.fail("Invalid PWM pin")
            }
            
        }
        
        // def enable_sercom_data_rdy_interrupt(self, sercom):
        // _sercom_inten.DATA_RDY = 1
        // self.write8(SEESAW_SERCOM0_BASE + sercom, SEESAW_SERCOM_INTEN, _sercom_inten.get())
        // def disable_sercom_data_rdy_interrupt(self, sercom):
        // _sercom_inten.DATA_RDY = 0
        // self.write8(SEESAW_SERCOM0_BASE + sercom, SEESAW_SERCOM_INTEN, _sercom_inten.get())
        // def read_sercom_data(self, sercom):
        // return self.read8(SEESAW_SERCOM0_BASE + sercom, SEESAW_SERCOM_DATA)
        public set_i2c_addr(addr: number) {
            this.eeprom_write8(_EEPROM_I2C_ADDR, addr)
            pause(250)
            this.i2c_device.device_address = addr
            this.sw_reset()
        }
        
        public get_i2c_addr() {
            return this.read8(_EEPROM_BASE, _EEPROM_I2C_ADDR)
        }
        
        public eeprom_write8(addr: number, val: number) {
            this.eeprom_write(addr, pins.createBuffer([val]))
        }
        
        public eeprom_write(addr: number, buf: Buffer) {
            this.write(_EEPROM_BASE, addr, buf)
        }
        
        public eeprom_read8(addr: number) {
            return this.read8(_EEPROM_BASE, addr)
        }
        
        public uart_set_baud(baud: number) {
            let cmd = pins.packBuffer(">I", baud)
            this.write(_SERCOM0_BASE, _SERCOM_BAUD, cmd)
        }
        
        public write8(reg_base: number, reg: number, value: number) {
            this.write(reg_base, reg, pins.createBuffer([value]))
        }
        
        public read8(reg_base: number, reg: number): number {
            let ret = pins.createBuffer(1)
            this.read(reg_base, reg, ret)
            return ret[0]
        }
        
        public read(reg_base: number, reg: number, buf: Buffer, delay: number = 0.001) {
            this.write(reg_base, reg)
            if (this._drdy !== null) {
                while (this._drdy.value === false) {
                    ;
                }
            } else {
                pause(delay * 1000)
            }
            
            {
                const i2c = this.i2c_device.begin()
                i2c.readInto(buf)
                i2c.end()
            }
        }
        
        public write(reg_base: number, reg: number, buf: Buffer = null) {
            let full_buffer = pins.createBuffer([reg_base, reg])
            if (buf !== null) {
                full_buffer += buf
            }
            
            if (this._drdy !== null) {
                while (this._drdy.value === false) {
                    ;
                }
            }
            
            {
                const i2c = this.i2c_device.begin()
                i2c.write(full_buffer)
                i2c.end()
            }
        }
        
    }
    
}
