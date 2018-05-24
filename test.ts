const dev = new seesaw.Seesaw()

dev.pinMode(15, 1)

// blinky
forever(() => {
    dev.digitalWrite(15, true)
    pause(500)
    dev.digitalWrite(15, false)
    pause(500)    
})
