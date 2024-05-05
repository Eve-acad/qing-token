class Panel extends Phaser.GameObjects.Container 
{
    
    //Panel swooshin'
    //
        appearing;
        Y_POS_IDLE;
        START_ANIM_SPEED = 131;
        anim_speed = this.START_ANIM_SPEED;
    //

    i; //Loop var

    constructor (scene, panel_image)
    {
        super(scene);
        this.Y_POS_IDLE = 360;
        var panel = scene.add.image(0, 0, panel_image);
        this.add(panel);
        scene.add.existing(this);
    }

    init()
    {
        this.visible = true;
        this.x = 640;  this.y = 1400;
        
        this.appearing = true;
        this.anim_speed = this.START_ANIM_SPEED;
    }
    
    update()
    {
        if (this.appearing)
        {
            if (this.y > this.Y_POS_IDLE)
            {
                this.anim_speed = Math.max(2, this.anim_speed / 1.111);
                this.y = Math.max(this.y - this.anim_speed, this.Y_POS_IDLE);
            }
            else
            {
                this.appearing = false;
            }
        }
    }
    
}