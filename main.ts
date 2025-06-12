function cursorValid () {
    return mycursor.x > layer_game.left && mycursor.x < layer_game.right + 1 && (mycursor.y > layer_game.top && mycursor.y < layer_game.bottom + 1)
}
browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (layer_game) {
        if (cursorValid() && layer_cover.image.getPixel(mycursor.x - (layer_game.left + 1), mycursor.y - (layer_game.top + 1)) == 10) {
            layer_cover.image.setPixel(mycursor.x - (layer_game.left + 1), mycursor.y - (layer_game.top + 1), 0)
            if (layer_mines.image.getPixel(mycursor.x - (layer_game.left + 1), mycursor.y - (layer_game.top + 1)) == 12) {
                layer_cover.image.replace(10, 0)
                gamestate = 0
            } else if (0 == minesleft && 1 == gamestate) {
                gamestate = 3
            }
        }
    }
})
browserEvents.MouseRight.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x, y) {
    if (cursorValid() && layer_game) {
        if (layer_cover.image.getPixel(mycursor.x - (layer_game.left + 1), mycursor.y - (layer_game.top + 1)) == 10) {
            layer_cover.image.setPixel(mycursor.x - (layer_game.left + 1), mycursor.y - (layer_game.top + 1), 13)
            if (layer_mines.image.getPixel(mycursor.x - (layer_game.left + 1), mycursor.y - 0) == 12) {
                minesleft += -1
            }
        } else if (layer_cover.image.getPixel(mycursor.x - (layer_game.left + 1), mycursor.y - (layer_game.top + 1)) == 13) {
            layer_cover.image.setPixel(mycursor.x - (layer_game.left + 1), mycursor.y - (layer_game.top + 1), 10)
            if (layer_mines.image.getPixel(mycursor.x - (layer_game.left + 1), mycursor.y - 0) == 12) {
                minesleft += 1
            }
        }
    }
})
function startgame (width: number, height: number, mines: number) {
    minesleft = mines
    sprites.destroy(mycursor)
    layer_game = sprites.create(image.create(width, height), SpriteKind.Player)
    layer_mines = sprites.create(image.create(width, height), SpriteKind.Player)
    layer_cover = sprites.create(image.create(width, height), SpriteKind.Player)
    mycursor = sprites.create(assets.image`cursor`, SpriteKind.Projectile)
    layer_mines.x = Math.round(scene.cameraProperty(CameraProperty.X))
    layer_mines.left = Math.round(layer_mines.left)
    layer_game.x = layer_mines.x
    layer_cover.x = layer_mines.x
    layer_mines.top = 21
    layer_game.top = 21
    layer_cover.top = 21
    for (let index = 0; index < mines; index++) {
        while (true) {
            xcheck = randint(0, width - 1)
            ycheck = randint(0, height - 1)
            if (layer_mines.image.getPixel(xcheck, ycheck) == 0) {
                layer_mines.image.setPixel(xcheck, ycheck, 12)
                for (let index = 0; index <= 2; index++) {
                    ofset = index - 1
                    for (let inedx = 0; inedx <= 2; inedx++) {
                        offsett = inedx - 1
                        layer_game.image.setPixel(xcheck + ofset, ycheck + offsett, layer_game.image.getPixel(xcheck + ofset, ycheck + offsett) + 1)
                    }
                }
                break;
            }
        }
    }
    layer_game.image.replace(0, 9)
    layer_cover.image.fill(10)
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (browserEvents.MouseLeft.isPressed()) {
        timer.throttle("action", 500, function () {
            mySprite = sprites.create(assets.image`oogabooga`, SpriteKind.Player)
            mySprite.y += 3
            if (otherSprite.image.equals(assets.image`easy`)) {
                startgame(9, 9, 10)
            } else if (otherSprite.image.equals(assets.image`medi`)) {
                startgame(16, 16, 40)
            } else {
                startgame(30, 30, 160)
            }
        })
        sprites.destroyAllSpritesOfKind(SpriteKind.Enemy)
    }
})
browserEvents.onMouseMove(function (x, y) {
    mycursor.setPosition(Math.round(x), Math.round(y))
})
let offsett = 0
let ofset = 0
let ycheck = 0
let xcheck = 0
let layer_mines: Sprite = null
let layer_cover: Sprite = null
let layer_game: Sprite = null
let mycursor: Sprite = null
let mySprite: Sprite = null
let gamestate = 0
let minesleft = 0
minesleft = 0
gamestate = 1
let aliveornot = sprites.create(assets.image`playinggame`, SpriteKind.Player)
aliveornot.y += -49
mySprite = sprites.create(assets.image`easy`, SpriteKind.Enemy)
mySprite.y += -24
mySprite = sprites.create(assets.image`medi`, SpriteKind.Enemy)
mySprite = sprites.create(assets.image`hard`, SpriteKind.Enemy)
mySprite.y += 24
mycursor = sprites.create(assets.image`cursor`, SpriteKind.Projectile)
game.onUpdateInterval(100, function () {
    if (0 == gamestate) {
        aliveornot.setImage(assets.image`lostgame`)
    } else if (1 == gamestate) {
        aliveornot.setImage(assets.image`playinggame`)
    } else {
        aliveornot.setImage(assets.image`wongame`)
    }
})
