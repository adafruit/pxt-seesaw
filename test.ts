const dev = new seesaw.Seesaw();

// blinky
forever(() => {
    dev.digitalWrite(13, true);
    pause(500)
    dev.digitalWrite(13, false);
    pause(500)    
})
