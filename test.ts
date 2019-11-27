let SeeSaw = seesaw.create(sAddr.add1)
basic.forever(function () {
    SeeSaw.digitalWrite(digitalPins.P9, 1)
    basic.pause(100)
    SeeSaw.digitalWrite(digitalPins.P9, 0)
    basic.pause(100)
})
