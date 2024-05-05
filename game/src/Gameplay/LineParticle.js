class LineParticle extends Phaser.GameObjects.Sprite
{
    
    alpha_dir;
    timer_wait_to_vanish;
    t_wtv_r = 3;
    
    constructor (scene)
    {
        super(scene, 0, 0, 'LineParticle');
        this.scene.add.existing(this);
    }
    
    init()
    {
        this.visible = true; this.alpha = 0.1;
        this.scale = 1.5;
        this.alpha_dir = 1;
        this.timer_wait_to_vanish = this.t_wtv_r;
    }
    
    update()
    {
        if (this.alpha_dir == 1)
        {
            this.scale = Math.max(1, this.scale - 0.05);
            if (this.alpha < 0.9)
            {
                this.alpha += 0.05;
            }
            else
            {
                this.alpha = 1;
                this.alpha_dir = -1;
            }
        }
        else
        {
            if (this.timer_wait_to_vanish > 0)
            {
                this.timer_wait_to_vanish--;
            }
            else
            {
                if (this.alpha > 0.1)
                {
                    this.alpha -= 0.05;
                    this.scale = Math.max(0, this.scale - 0.05);
                }
                else
                {
                    this.scene.object_pooler.pool_obj(1, this);
                }
            }
        }
    }
    
}
