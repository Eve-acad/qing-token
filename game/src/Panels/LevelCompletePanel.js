class LevelCompletePanel extends Panel
{
    
    btn_continue;
    btn_menu;

    constructor (scene)
    {
        super(scene, 'LevelCompletePanel');
        this.btn_continue = new CustomButton(scene, -235, -78, 'ContinueButton');
        this.btn_menu = new CustomButton(scene, -235, 80, 'MenuButton');
        this.add(this.btn_continue);  this.add(this.btn_menu);
    }

    init()
    {
        super.init();
        this.scene.play_sound('snd_win');
        GlobalAttributes.stage_reached = Math.min(20, GlobalAttributes.stage_reached + 1);
        localStorage.setItem('stage_reached', GlobalAttributes.stage_reached);
    }
    
    update()
    {
        super.update();
        this.btn_continue.update();
        if (this.btn_continue.check_clicked())
        {
            if (GlobalAttributes.stage_selected != 20)
            {
                this.scene.continue_next_level();
            }
            else
            {
                this.scene.back_to_menu();
            }
            return;
        }
        this.btn_menu.update();
        if (this.btn_menu.check_clicked())
        {
            this.scene.back_to_menu();
        }
    }
    
}