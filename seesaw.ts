/// <reference no-default-lib="true"/>
/**
 * Adafruit Seesaw, ported from Circuit Python implemenetation.
 */
namespace seesaw {
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
    const _ADC_INPUT_0_PIN = 0x02
    const _ADC_INPUT_1_PIN = 0x03
    const _ADC_INPUT_2_PIN = 0x04
    const _ADC_INPUT_3_PIN = 0x05
    const _PWM_0_PIN = 0x04
    const _PWM_1_PIN = 0x05
    const _PWM_2_PIN = 0x06
    const _PWM_3_PIN = 0x07
    const _HW_ID_CODE = 0x55
    const _EEPROM_I2C_ADDR = 0x3F

    export class Seesaw {
        private device: pins.I2CDevice;

        static INPUT = 0x00;
        static OUTPUT = 0x01;
        static INPUT_PULLUP = 0x02;

        constructor(addr: number = 0x49) {
            this.device = new pins.I2CDevice(addr)
            this.softwareReset()
        }

        public softwareReset() {
            /** Trigger a software reset of the SeeSaw chip */
            this.write8(_STATUS_BASE, _STATUS_SWRST, 0xFF)
            pause(500)
            const chip_id = this.read8(_STATUS_BASE, _STATUS_HW_ID)
            if (chip_id != _HW_ID_CODE) {
                control.fail(`Seesaw hardware ID returned (${chip_id}) is not correct! Expected ${_HW_ID_CODE}. Please check your wiring.`);
            }

        }

        public options(): number {
            const buf = pins.createBuffer(4)
            this.read(_STATUS_BASE, _STATUS_OPTIONS, buf, 4)
            return buf.getNumber(NumberFormat.UInt32LE, 0);
        }

        public version(): number {
            const buf = pins.createBuffer(4)
            this.read(_STATUS_BASE, _STATUS_VERSION, buf, 4);
            return buf.getNumber(NumberFormat.UInt32LE, 0);
        }

        public pinMode(pin: number, mode: number) {
            this.pinModeBulk(1 << pin, mode)
        }

        public digitalWrite(pin: number, value: number) {
            this.digitalWriteBulk(1 << pin, value)
        }

        public digitalRead(pin: number): boolean {
            return this.digitalReadBulk(1 << pin) != 0
        }

        public digitalReadBulk(pinSet: number): number {
            const buf = pins.createBuffer(4)
            this.read(_GPIO_BASE, _GPIO_BULK, buf)
            // TODO: weird overflow error, fix
            const ret = (buf[0] & 0xF) << 24 | buf[1] << 16 | buf[2] << 8 | buf[3]
            return ret & pinSet;
        }

        public setGPIOInterrupts(pinSet: number, enabled: number) {
            const cmd = pins.createBuffer(4);
            cmd.setNumber(NumberFormat.UInt32LE, 0, pinSet)
            if (enabled) {
                this.write(_GPIO_BASE, _GPIO_INTENSET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_INTENCLR, cmd)
            }

        }

        public analogRead(pin: number): number {
            const buf = pins.createBuffer(2)
            const pin_mapping = [_ADC_INPUT_0_PIN, _ADC_INPUT_1_PIN, _ADC_INPUT_2_PIN, _ADC_INPUT_3_PIN]
            if (pin_mapping.indexOf(pin) < 0) {
                control.fail("Invalid ADC pin")
            }

            this.read(_ADC_BASE, _ADC_CHANNEL_OFFSET + pin_mapping.indexOf(pin), buf)
            const ret = buf[0] << 8 | buf[1]
            pause(1)
            return ret
        }

        public pinModeBulk(pinSet: number, mode: number) {
            const cmd = pins.createBuffer(4);
            cmd.setNumber(NumberFormat.UInt32LE, 0, pinSet)
            if (mode == Seesaw.OUTPUT) {
                this.write(_GPIO_BASE, _GPIO_DIRSET_BULK, cmd)
            } else if (mode == Seesaw.INPUT) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
            } else if (mode == Seesaw.INPUT_PULLUP) {
                this.write(_GPIO_BASE, _GPIO_DIRCLR_BULK, cmd)
                this.write(_GPIO_BASE, _GPIO_PULLENSET, cmd)
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            }

        }

        public digitalWriteBulk(pinSet: number, value: number) {
            const cmd = pins.createBuffer(4);
            cmd.setNumber(NumberFormat.UInt32LE, 0, pinSet);
            if (value) {
                this.write(_GPIO_BASE, _GPIO_BULK_SET, cmd)
            } else {
                this.write(_GPIO_BASE, _GPIO_BULK_CLR, cmd)
            }

        }

        public analogWrite(pin: number, value: number) {
            const pin_mapping = [_PWM_0_PIN, _PWM_1_PIN, _PWM_2_PIN, _PWM_3_PIN]
            if (pin_mapping.indexOf(pin) >= 0) {
                const cmd = pins.createBufferFromArray([pin_mapping.indexOf(pin), value]);
                this.write(_TIMER_BASE, _TIMER_PWM, cmd)
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
        public setI2cAddress(addr: number) {
            this.eepromWrite8(_EEPROM_I2C_ADDR, addr)
            pause(250)
            this.device.address = addr
            this.softwareReset()
        }

        public i2cAddress(): number {
            return this.read8(_EEPROM_BASE, _EEPROM_I2C_ADDR)
        }

        public eepromWrite8(addr: number, val: number) {
            this.eepromWrite(addr, pins.createBufferFromArray([val]))
        }

        public eepromWrite(addr: number, buf: Buffer) {
            this.write(_EEPROM_BASE, addr, buf)
        }

        public eepromRead8(addr: number): number {
            return this.read8(_EEPROM_BASE, addr)
        }

        public uartSetBaud(baud: number) {
            const cmd = pins.createBuffer(4);
            cmd.setNumber(NumberFormat.UInt32LE, 0, baud);
            this.write(_SERCOM0_BASE, _SERCOM_BAUD, cmd)
        }

        public write8(reg_base: number, reg: number, value: number) {
            this.write(reg_base, reg, pins.createBufferFromArray([value]))
        }

        public read8(reg_base: number, reg: number): number {
            const ret = pins.createBuffer(1)
            this.read(reg_base, reg, ret)
            return ret[0]
        }

        public read(reg_base: number, reg: number, buf: Buffer, delay: number = 0.001) {
            this.write(reg_base, reg)
            pause(delay * 1000)
            this.device.begin()
            this.device.readInto(buf)
            this.device.end();
        }

        public write(reg_base: number, reg: number, buf: Buffer = null) {
            const n = 2 + (buf ? buf.length : 0);
            const full_buffer = pins.createBuffer(n);
            full_buffer.setNumber(NumberFormat.UInt8LE, 0, reg_base);
            full_buffer.setNumber(NumberFormat.UInt8LE, 1, reg);
            if (buf)
                full_buffer.write(2, buf);
            this.device.begin()
            this.device.write(full_buffer)
            this.device.end()
        }
    }
}
