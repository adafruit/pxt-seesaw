const dev = new seesaw.Seesaw(null)
//dev.pinMode(15, 1)

// blinky
for (let i = 0; i < 10; ++i) {
    dev.digitalWrite(15, 1)
    basic.pause(500)
    dev.digitalWrite(15, 0)
    basic.pause(500)    
}
