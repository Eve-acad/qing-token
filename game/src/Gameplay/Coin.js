class Coin extends Phaser.GameObjects.Sprite
{
    
    framezies;
    x_dir = 1;  y_dir = -1;
    x_speed = 5;  y_speed = 15;
    movement_angle;
    fx;  hc = 0;
    y_de_accel_factor = 1.035;  y_accel_factor = 1.035;
    MIN_LAUNCH_SPEED = 7;
    MAX_LAUNCH_SPEED = 25;
    MAX_DOWN_SPEED = 15;
    
    constructor (scene)
    {
        super(scene, 0, 0, 'Coin1');
        //this.setOrigin(0.5, 0.5);
        this.scene.add.existing(this);
        this.fx = this.preFX.addColorMatrix();
    }

    launch()
    {
        this.scale = 1;
        this.fx.hue(0);  this.hc = 0;
        if (Math.random() < GameplayParams.bomb_percent[GlobalAttributes.stage_selected - 1])
        {
            this.framezies = 6;
        }
        else
        {
            if (Math.random() < 0.25)
            {
                this.framezies = 5;
                this.hc = -180;
            }
            else
            {
                this.framezies = (1 + Math.round(Math.random() * 3));
            }
        }
        var ts = (this.framezies != 6) ? ('Coin' + this.framezies) : 'bomb';
        //console.log(ts);
        this.setTexture(ts);
        this.visible = true;  this.alpha = 1.0;
        this.x_dir = (Math.random() <= 0.5) ? -1 : 1;
        this.y_dir = -1;
        this.movement_angle = (-90 + Math.random() * 60 * this.x_dir);
        this.movement_angle *= Math.PI / 180;
        this.x = 640 + (Math.random() * 640) * -this.x_dir;
        this.y = 800;
        this.y_speed = this.MIN_LAUNCH_SPEED + (this.MAX_LAUNCH_SPEED - this.MIN_LAUNCH_SPEED) * Math.random();
    }
    
    update()
    {
        this.hue_anim();
        this.y += this.y_speed * this.y_dir;
        this.x += Math.cos(this.movement_angle) * this.x_speed;
        this.angle += Math.cos(this.movement_angle);
        if (this.y_dir == -1)
        {
            if (this.y_speed > 0.15)
            {
                this.y_speed = Math.max(0, this.y_speed / this.y_de_accel_factor);
            }
            else
            {
                this.y_speed = 0.20;
                this.y_dir = 1;
            }
        }
        else
        {
            this.y_speed = Math.min(this.MAX_DOWN_SPEED, this.y_speed * this.y_accel_factor);
            if (this.y > 780)
            {
                if (GlobalAttributes.game_mode == 1 && this.scene.session_status == 0 && this.framezies != 6)
                {
                    this.scene.inc_x_strikes();
                    this.scene.play_sound('snd_bomb');  //scebe
                }
                this.scene.object_pooler.pool_obj(0, this);
            }
        }
        if (this.framezies == 5 && this.alpha < 1)
        {
            if (this.alpha > 0.1)
            {
                this.scale += 0.063;
                this.alpha -= 0.02;
            }
            else
            {
                this.scene.object_pooler.pool_obj(0, this);
            }
        }
    }

    hue_anim()
    {
        if (this.framezies == 5)
        {
            this.fx.hue(this.hc);
            this.hc += 7;
            if (this.hc >= 180)
            {
                this.hc = -180;
            }
        }
    }
    
}
