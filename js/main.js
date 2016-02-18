    ///////////////////////////////////////////////////////////////
    //Game: Gravity Man - Justin Lawson                          //
    //Sources: Code from Phaser example "Starstruck" used        //
    //         Tilemap file from Phaser example "Starstruck" used//
    ///////////////////////////////////////////////////////////////

    window.onload = function() {

        var game = new Phaser.Game(600, 400, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('floor', 'assets/Block.png');
    game.load.spritesheet('knight', 'assets/Knight.png', 32, 40);//Knight: Player Character//
    game.load.spritesheet('slimeSmall', 'assets/SlimeSmall.png', 32, 32);//Small Slime: Basic slime, jump over or kill//
    game.load.spritesheet('slimeHeavy', 'assets/SlimeMedium.png', 32, 32);//Heavy Slime: Cannot be killed//
    game.load.spritesheet('slimeFlying', 'assets/SlimeFlying.png', 32, 32);//Flying Slime: Cannot be jumped over//
    game.load.image('princess', 'assets/Princess.png');//Princess: Reach the princess to win the game//
    game.load.image('arrow', 'assets/Arrow.png');//Arrow: Projectile shot by player//
    game.load.image('bg', 'assets/bg.png');//background//
    game.load.audio('shoot', 'assets/Blop-Mark_DiAngelo-79054334.mp3');
    game.load.audio('jump', 'assets/Mario_Jumping-Mike_Koenig-989896458.mp3');
    game.load.audio('gameover', 'assets/dun_dun_dun-Delsym-719755295.mp3');
    game.load.audio('win', 'assets/SMALL_CROWD_APPLAUSE-Yannick_Lemieux-1268806408.mp3');
}

var player;
var jumpTimer = 0;
var cursors;
var shootButton;
var bg;
var distance = 5000;
var distString = '';
var distText;
var slimes;
var floor;
var arrow;
var arrowTimer = 0;
var slimeTimer = 3500;
var princess;
var stateText;
var shootsfx;
var jumpsfx;
var losesfx;
var winsfx;
var won = false;
        
function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    game.physics.arcade.gravity.y = 250;
    
    bg = game.add.sprite(0, 0, 'bg');
    
    stateText = game.add.text(32, 200, "Game Over! Click to restart!", {font: '34px Arial', fill: '#000'});
    stateText.visible = false;
    
    floor = game.add.sprite(0, 368, 'floor');
    game.physics.enable(floor, Phaser.Physics.ARCADE);
    floor.body.collideWorldBounds = true;

    player = game.add.sprite(32, 300, 'knight');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.setSize(32, 40, 0, 0);

    player.animations.add('run', [0, 1, 2, 3], 10, true);
    player.animations.play('run');
    
    slimes = game.add.group();
    
    distString = 'Distance: ';
    distText = game.add.text(10, 10, distString + distance, {font: '34px Arial', fill: '#000'});

    cursors = game.input.keyboard.createCursorKeys();
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    shootsfx = game.add.audio('shoot');
    jumpsfx = game.add.audio('jump');
    losesfx = game.add.audio('gameover');
    winsfx = game.add.audio('win');
    
    shootsfx.addMarker('shootArrow', 0, 1);
    jumpsfx.addMarker('jump', 0, 0.5);
    losesfx.addMarker('gameover', 0, 2);
    winsfx.addMarker('winGame', 0, 6);
}

function update() {

    game.physics.arcade.collide(player, floor);
    game.physics.arcade.collide(slimes, floor);
    game.physics.arcade.collide(princess, floor);

    player.body.velocity.x = 0;

    
    if (cursors.up.isDown && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -150;
        jumpTimer = game.time.now + 1250;
        jumpsfx.play('jump');
    }
    else if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
    }
    
    
    if (shootButton.isDown && game.time.now > arrowTimer)
    {
            arrow = game.add.sprite(player.x, player.y, 'arrow');
            game.physics.enable(arrow, Phaser.Physics.ARCADE);
            arrow.body.setSize(15, 32, 0, 0);
            arrow.body.velocity.x = 500;
            arrow.body.velocity.y = -40;
            arrowTimer = game.time.now + 750;
            shootsfx.play('shootArrow');
    }
    
    if(game.time.now > slimeTimer && distance > 0)
    {
        createSlime();
        slimeTimer = game.time.now + 2500;
    }
    
    if(distance > 0)
        distance--;
    distText.text = distString + distance;
    
    game.physics.arcade.overlap(slimes, player, slimeCollision, null, this);
    game.physics.arcade.overlap(arrow, slimes, arrowCollision, null, this);
    
    if(!won)
        game.physics.arcade.overlap(player, princess, princessCollision, null, this);
    
    if(distance === 0 && princess == null)
    {
        princess = game.add.sprite(600, 300, 'princess');
        game.physics.enable(princess, Phaser.Physics.ARCADE);
        princess.body.setSize(32, 40, 0, 0);
        princess.body.velocity.x = -100;
    }
    
    if(princess != null && princess.body.x < 200)
        princess.body.velocity.x = 0;
}

//kill player and prompt to restart game//
function slimeCollision(player, slime)
{
    player.kill();
    stateText.text = "Game Over! Click to restart!";
    losesfx.play('gameover');
    stateText.visible = true;
    game.input.onTap.addOnce(restart,this);
}
        
function arrowCollision(arrow, slime)
{
    arrow.kill();
    if(slime.body.velocity.x != -100)//will kill any slime faster than Heavy Slime//
    {
        slime.kill();
    }
}
        
function princessCollision(player, princess)
{
    won = true;
    stateText.text = "Congratulations, you win!\n click to restart!";
    winsfx.play('winGame');
    stateText.visible = true;
    game.input.onTap.addOnce(restart, this);
}

//creates a random slime//
function createSlime()
{
    var num = Math.random() * 3;
    if(num > 2)
    {
        var slime = slimes.create(600, 300, 'slimeSmall');//Basic Slime//
        game.physics.enable(slime, Phaser.Physics.ARCADE);
        slime.body.setSize(32, 32, 0, 0);
        slime.body.velocity.x = -150;
        slime.animations.add('slime', [0, 1], 3, true);
        slime.animations.play('slime');
    }
    
    else if(num > 1)
    {
        var slime = slimes.create(600, 300, 'slimeHeavy');//Cannot be killed, must jump over//
        game.physics.enable(slime, Phaser.Physics.ARCADE);
        slime.body.setSize(32, 32, 0, 0)
        slime.body.velocity.x = -100;
        slime.animations.add('slime', [0, 1], 3, true);
        slime.animations.play('slime');
    }
    
    else
    {
        var slime = slimes.create(600, 320, 'slimeFlying');//Cannot jump over, must be killed//
        game.physics.enable(slime, Phaser.Physics.ARCADE);
        slime.body.setSize(32, 32, 0, 0)
        slime.body.allowGravity = false;
        slime.body.velocity.x = -200;
        slime.animations.add('slime', [0, 1, 2], 5, true);
        slime.animations.play('slime');
    }
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}
//restart game//
function restart()
{
    player.revive();
    distance = 5000;
    stateText.visible = false;
    slimes.removeAll();
    princess.kill();//Don't worry, she just warped away!//
    princess = null;
    player.body.x = 32;
    slimeTimer = 3500;
    won = false;
}

    };