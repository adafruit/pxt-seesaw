const dev = new seesaw.Seesaw();

// blinky
forever(() => {
    dev.digitalWrite(13, 1);
    pause(500)
    dev.digitalWrite(13, 0);
    pause(500)    
})
