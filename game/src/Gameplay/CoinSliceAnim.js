class CoinSliceAnim extends Phaser.GameObjects.Sprite
{
    
    rotation_speed = 5;
    rotation_dir = 1;
    t_anim;
    type;

    constructor (scene)
    {
        super(scene, 0, 0, 'Coin3');
        scene.add.existing(this);
    }
    
    init(coin_type)
    {
        this.type = coin_type;
        this.scale = 1;
        this.rotation_speed = Math.random() * 3;
        this.rotation_dir = Math.random() < 0.5 ? -1 : 1;
        this.play('c' + coin_type + 's');
        this.setOrigin(0.6,0.6);
        this.visible = true;
    }
    
    update()
    {
        this.angle += this.rotation_speed * this.rotation_dir;
        if (this.type == 6)
        {
            this.scale += 0.02;
        }
        if (this.frame.name == ( (this.type != 6) ? 15 : 5) )
        {
            this.scene.object_pooler.pool_obj(2, this);
        }
    }
    
}
