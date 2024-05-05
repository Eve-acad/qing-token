class Achievement extends Phaser.GameObjects.Sprite
{
    
    constructor (scene, num)
    {
        super(scene, 55, 55, 'Achievement' + num);
        scene.add.existing(this);
    }
    
}
