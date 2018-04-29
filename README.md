# seesaw (Beta)

A MakeCode package for [Adafruit Seesaw I2C protocol](https://learn.adafruit.com/adafruit-seesaw-atsamd09-breakout?view=all).

## Usage

* Go to **Advanced**, **Extensions** and search for **seesaw**, then add it to your project.

Create a ``seesaw.Seesaw`` object and call the various interfaces. 
Optionally, pass the i2c device address in the constructor.

Here is the famous ``blinky`` example.
```typescript
const dev = new seesaw.Seesaw();
forever(() => {
    dev.digitalWrite(13, 1);
    pause(500)
    dev.digitalWrite(13, 0);
    pause(500)    
})
```

## Building

* install the PXT cli (make sure Node.js 8+ is installed)

```
npm install -g pxt
```

* clone the repository

```
git clone https://github.com/Adafruit/pxt-seesaw

```

* install the Adafruit editor

```
pxt target adafruit
```

* build and run test

```
pxt
```

## Releasing

To create a new release, run ``pxt bump`` from the project folder. Use ``semver`` logic to device if you need to bump major, minor etc... The editor will automatically pick the latest release in the repo.

## License

MIT

## Supported targets

* for PXT/adafruit https://makecode.adafruit.com
* for PXT/maker https://maker.makecode.com
* for PXT/codal
(The metadata above is needed for package search.)