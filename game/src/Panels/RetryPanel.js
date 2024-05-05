class RetryPanel extends Panel
{
    
    btn_retry;
    btn_menu;

    constructor (scene)
    {
        super(scene, 'RetryPanel');
        this.btn_retry = new CustomButton(scene, -235, -78, 'RetryButton');
        this.btn_menu = new CustomButton(scene, -235, 80, 'MenuButton');
        this.add(this.btn_retry);  this.add(this.btn_menu);
    }
    
    init()
    {
        super.init();
        this.scene.play_sound('snd_retry');
    }

    update()
    {
        super.update();
        this.btn_retry.update();
        if (this.btn_retry.check_clicked())
        {
            this.scene.restart();
            return;
        }
        this.btn_menu.update();
        if (this.btn_menu.check_clicked())
        {
            this.scene.back_to_menu();
        }
    }
    
}