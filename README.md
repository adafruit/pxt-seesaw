# seesaw (Beta)

A MakeCode package for [Adafruit Seesaw I2C protocol](https://learn.adafruit.com/adafruit-seesaw-atsamd09-breakout?view=all).

## Usage

Create a ``seesaw.Seesaw`` object and call the various interfaces. 
Optionally, pass the i2c device address in the constructor.

```typescript
const dev = new seesaw.Seesaw();
dev.digitalWrite(1, 1);
```

## License

MIT

## Supported targets

* for PXT/adafruit https://makecode.adafruit.com
* for PXT/maker https://maker.makecode.com
* for PXT/codal
(The metadata above is needed for package search.)