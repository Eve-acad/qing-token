class MenuScene extends Phaser.Scene
{
    
    btn_play; btn_level_mode; btn_endless_mode; back_button; sounds_button; music_button; fullscreen_button; btn_achievements; btn_clear_sd;
    txt_highscore;
    xs;
    //LSBS
    //
        lsbs; achievements;
        LSB_START_X = 288;  LSB_START_Y = 146;
        LSB_HOR_SPACING = 146;  LSB_VER_SPACING = 146;
        ROWS = 4;  COLUMNS = 5;
        subselection;
    //
    
    constructor()
    {
        super('MS');
    }

    create()
    {
        console.log("sr: " + GlobalAttributes.stage_reached)
        this.lsbs = []; this.achievements = [];
        var bg = this.add.image(0, 0, 'Bg_Menu'); bg.setOrigin(0,0);
        this.create_achievement_instances();
        this.btn_play = new CustomButton(this, 533, 400, 'PlayButton');
        this.btn_play.hover_tint = "555"; this.btn_play.click_tint = "555";
        this.back_button = new CustomButton(this, 88, 638, 'BackButton');
        this.back_button.visible = false;
        this.sounds_button = new CustomButton(this, 1068, 654, 'SoundsButton');
        this.music_button = new CustomButton(this, 1138, 654, 'MusicButton');
        this.fullscreen_button = new CustomButton(this, 1208, 654, 'FullScreenButton');
        this.txt_highscore = this.add.text(420, 510, 'Highscore: ' + GlobalAttributes.best_score, 
                        { fontFamily: 'Arial', fontSize: '55px', fill: '#FFFFFF', stroke: '#222222', strokeThickness: 3});
        this.txt_highscore.visible = false;
        this.xs = [];
        for (var xsi = 0; xsi < 2; xsi++)
        {
            var pointer_button = (xsi == 0 ? this.sounds_button : this.music_button);
            var x = this.add.image(pointer_button.x + 27, pointer_button.y + 23, 'X');  x.scale = 0.8;  x.alpha = 0.5;  
            x.visible = (xsi == 0 ? !GlobalAttributes.sounds : !GlobalAttributes.music);
            this.xs.push(x);
        }
    }
    
    update()
    {
        this.smf_buttons_update();
        if (this.btn_play.visible)
        {
            this.base_screen_update();
        }
        else
        {
            if (this.btn_level_mode.visible)
            {
                this.mode_select_update();
            }
            else
            {
                if (this.subselection == 0)
                {
                    this.level_select_update();
                }
                else
                {
                    this.achievements_section_update();
                }
            }
        }
    }

    achievements_section_update()
    {
        this.back_button.update();
        if (this.back_button.check_clicked())
        {
            for (var aaa = 0; aaa < this.achievements.length; aaa++)
            {
                this.achievements[aaa].visible = false;
            }
            this.back_button_clicked();
        }
    }

    smf_buttons_update()
    {
        this.sounds_button.update();
        this.music_button.update();
        this.fullscreen_button.update();
        if (this.sounds_button.check_clicked())
        {
            GlobalAttributes.sounds = !GlobalAttributes.sounds;
            this.xs[0].visible = !GlobalAttributes.sounds;
            this.play_sound('snd_button');
        }
        if (this.music_button.check_clicked())
        {
            GlobalAttributes.music = !GlobalAttributes.music;
            if (GlobalAttributes.music)
            {
                this.sound.play('bgm', {loop: true});
            }
            else
            {
                this.sound.stopByKey('bgm');
            }
            this.xs[1].visible = !GlobalAttributes.music; 
            this.play_sound('snd_button');
        }
        if (this.fullscreen_button.check_clicked())
        {
            this.play_sound('snd_button');
            if (this.scale.isFullscreen) 
            {
                this.scale.stopFullscreen();
            } 
            else 
            {
                this.scale.startFullscreen();
            }
        }
    }

    base_screen_update()
    {
        this.btn_play.update();
        if (this.btn_play.check_clicked())
        {
            this.play_sound('snd_button');
            this.btn_achievements = new CustomButton(this, 150, 333, 'AchievementsButton');
            this.btn_level_mode = new CustomButton(this, 413, 233, 'LevelModeButton');
            this.btn_endless_mode = new CustomButton(this, 413, 388, 'EndlessModeButton');
            this.btn_clear_sd = new CustomButton(this, 575, 630, 'ClearSaveDataButton');
            this.btn_play.visible = false; this.txt_highscore.visible = true;
        }
    }

    mode_select_update()
    {
        this.btn_level_mode.update();  this.btn_endless_mode.update();  this.btn_achievements.update();  this.btn_clear_sd.update();
        if (this.btn_level_mode.check_clicked())
        {
            this.play_sound('snd_button');
            this.btn_level_mode.visible = false;  this.btn_endless_mode.visible = false;  this.back_button.visible = true; this.btn_achievements.visible = false;
            this.txt_highscore.visible = false; this.btn_clear_sd.visible = false;
            this.subselection = 0;
            this.create_level_select_buttons();
            return;
        }
        if (this.btn_endless_mode.check_clicked())
        {
            this.play_sound('snd_button');
            GlobalAttributes.stage_selected = 1;
            GlobalAttributes.game_mode = 1;
            this.scene.stop();
            this.scene.start('GS');
            return;
        }
        if (this.btn_achievements.check_clicked())
        {
            this.play_sound('snd_button');
            this.btn_achievements.visible = false; this.txt_highscore.visible = false;
            this.btn_level_mode.visible = false;  this.btn_endless_mode.visible = false;  this.back_button.visible = true;
            this.btn_clear_sd.visible = false;
            this.subselection = 1;
            this.create_achievements_section();
            return;
        }
        if (this.btn_clear_sd.check_clicked())
        {
            this.play_sound('snd_button');
            localStorage.setItem('best_score', 0); localStorage.setItem('stage_reached', 1); 
            localStorage.setItem('a1', "false");localStorage.setItem('a2', "false"); localStorage.setItem('a3', "false"); localStorage.setItem('a4', false);localStorage.setItem('a5', "false"); 
            GlobalAttributes.best_score = 0;
            this.txt_highscore.text = "Highscore: 0";
            GlobalAttributes.stage_reached = 1;
            for (var al = 0; al < 5; al++)
            {
                GlobalAttributes.achievements_unlocked[al] = false;
            }
        }
    }

    level_select_update()
    {
        var override = false;
        this.back_button.update();
        if (this.back_button.check_clicked())
        {
            this.back_button_clicked();
            override = true;
        }
        if (this.lsbs.length == null && !override) { return; }
        for (var i = 0; i < this.lsbs.length; i++)
        {
            if (override)
            {
                this.lsbs[i].visible = false; this.lsbs[i].tf.visible = false;
                continue;
            }
            if (!this.lsbs[i].visible)
            {
                break;
            }
            this.lsbs[i].update();
            if (this.lsbs[i].check_clicked())
            {
                this.play_sound('snd_button');
                GlobalAttributes.stage_selected = this.lsbs[i].num;
                GlobalAttributes.game_mode = 0;
                this.scene.stop();
                this.scene.start('GS');
                break;
            }
        }
    }
    
    create_level_select_buttons()
    {
        this.lsbs = [];
        if (this.lsbs.length == 0)
        {
            for (var row = 0; row < this.ROWS; row ++)
            {
                for (var col = 0; col < this.COLUMNS; col++)
                {
                    var lsb = new LevelSelectButton(this, this.LSB_START_X + this.LSB_HOR_SPACING * col, this.LSB_START_Y + this.LSB_VER_SPACING * row);
                    lsb.set_num( (this.COLUMNS * row) + (col + 1) );
                    this.lsbs.push(lsb);
                    lsb.visible = !(GlobalAttributes.stage_reached <= this.lsbs.length - 1);
                    lsb.tf.visible = lsb.visible;
                }
            }
        }
        else
        {
            for (var a = 0; a < this.lsbs.length; a++)
            {
                this.lsbs[a].visible = !(GlobalAttributes.stage_reached <= a + 1);  
                this.lsbs[a].tf.visible = this.lsbs[a].visible;
            }
        }
    }

    create_achievements_section()
    {
        for (var ac = 0; ac < 5; ac++)
        {
            this.achievements[ac].visible = true;
            this.achievements[ac].alpha = (GlobalAttributes.achievements_unlocked[ac]) ? 1 : 0.1;
        }
    }

    create_achievement_instances()
    {
        for (var ach = 0; ach < 5; ach++)
        {
            var achievement = new Achievement(this, ach + 1);
            achievement.x = 233 + ach * 200;
            achievement.y = 333;
            achievement.visible = false;
            this.achievements.push(achievement);
        }
    }

    back_button_clicked()
    {
        this.play_sound('snd_button');
        this.btn_level_mode.visible = true; this.btn_endless_mode.visible = true;  this.back_button.visible = false; this.btn_achievements.visible = true;
        this.txt_highscore.visible = true; this.btn_clear_sd.visible = true;
    }

    play_sound(snd)
    {
        if (GlobalAttributes.sounds)
        {
            this.sound.play(snd);
        }
    }
    
}
