class CustomButton extends Phaser.GameObjects.Image
{
    
    base_alpha = 0.8;
    hover_alpha = 0.9;
    click_alpha = 1.0;

    base_tint = "555";
    hover_tint = "0xffffaa";
    click_tint = "0xfaafcc";

    valid_click;
    clicked_frame_timer = 0;
    CFT_RESET = 0.313 * 60; //[CUSTOMIZABLE]

    clicked_message = false;
    initted = false;

    constructor(scene, x, y, sprite)
    {
        super(scene, x, y, sprite);
        this.setOrigin(0,0);
        scene.add.existing(this);
            
        this.alpha = this.base_alpha;
        
        //Click event:
        this.setInteractive();
        this.on('pointerup', function()
        {
            this.clicked();
        }, this);
    }

    set_tint(not_hover)
    {
        var tint_to_check = (not_hover == true) ? this.base_tint : ( (this.clicked_frame_timer > 0) ? this.hover_tint : this.hover_tint);
        if (tint_to_check != 555)
        {
            this.setTint(parseInt(tint_to_check)); //333
        }
        else
        {
            this.clearTint();
        }
    }
    
    update()
    {
        if (!this.initted)
        {
            this.set_tint(true);
            this.initted = true;
        }
        
        //Checking for x&y offset from stage anchor if inside a container:
        var cx = 0;
        var cy = 0;
        if (this.parentContainer != null)
        {
            cx = this.parentContainer.x;
            cy = this.parentContainer.y;
        }
        
        if (this.clicked_frame_timer > 0)
        {
            this.clicked_frame_timer--;
            if (this.alpha != this.click_alpha)
            {
                this.alpha = this.click_alpha;
                this.set_tint(false);
            }
        }
        else
        {
            var x1 = this.x + cx - ((this.scaleX == -1) * this.width);
            //Collision with mouse checking:
            if (this.scene.game.input.mousePointer.x > x1 && this.scene.game.input.mousePointer.x < x1 + this.width * Math.abs(this.scaleX)
                && this.scene.game.input.mousePointer.y > this.y + cy && this.scene.game.input.mousePointer.y < this.y + cy + this.height * Math.abs(this.scaleY))
            {
                if (this.alpha != this.hover_alpha)
                {
                    this.alpha = this.hover_alpha;
                    this.set_tint(false);
                }
            }
            else
            {
                if (this.alpha != this.base_alpha)
                {
                    this.alpha = this.base_alpha;
                    this.set_tint(true);
                }
            }
        }
    }

    check_clicked()
    {
        var return_val = this.clicked_message;
        this.clicked_message = false;
        return return_val;
    }

    //valid_press is by default true. Calling with false as arg plays invalid press snd 
    clicked(valid_press = true)
    {
        if (this.visible)
        {
            this.clicked_message = true;
            this.clicked_frame_timer = this.CFT_RESET;
        }
    }

}
