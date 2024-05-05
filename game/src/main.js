var config = 
{
    type: Phaser.AUTO,
    backgroundColor: 0xCCCCCC,
    scale: 
    {
        parent: 'gameBody',
        mode: Phaser['Scale']['FIT'],
        width: 1280,
        height: 720
    },
    fps: 
    {
      target: 60,
      min: 60,
      forceSetTimeOut: true
    },
    scene:
        [
            PreloaderScene,
            MenuScene,
            GameplayScene
        ]
};
game = new Phaser['Game'](config);
