class GameplayScene extends Phaser.Scene
{
    
    //Objects
    //
        bg;
        coins = []; line_particles = []; coin_slice_anims = [];
        char; sword;
        xs = [];
    //
    //Main gameplay vars
    //
        x_strikes = 0; score = 0; time_left;
        burst_throw_max = 1;
        paused = false;
        session_status = 0;
    //
    //HUD
        txt_score;  txt_timer;
        btn_pause;  btn_menu;
        grey_screener;
        panel;
        spr_achievement_unlocked; spr_achievement;
    //
    //Touch/Click
    //
        touch_held = false;
        touch_start_x;  touch_start_y;
        mrp_x; mrp_y;
    //
    //Timers
    //
        timer_frames = 60;
        timer_next_coin = 33;  t_nc_r = 100;
        timer_new_line_particle = 0;  t_nlp_r = 0;
        timer_max_swipe_length_checker;  t_mslc_r = 10;
    //
    static anim_keys_inited = false;
    i; j; k;

    constructor()
    {
        super('GS');
    }

    create()
    {  
        if (!GameplayScene.anim_keys_inited)
        {
            this.anims.create({ key: 'c1s', frames: this.anims.generateFrameNumbers('Coin1SliceAnim'), frameRate: 55, repeat: -1 });
            this.anims.create({ key: 'c2s', frames: this.anims.generateFrameNumbers('Coin2SliceAnim'), frameRate: 55, repeat: -1 });
            this.anims.create({ key: 'c3s', frames: this.anims.generateFrameNumbers('Coin3SliceAnim'), frameRate: 55, repeat: -1 });
            this.anims.create({ key: 'c4s', frames: this.anims.generateFrameNumbers('Coin4SliceAnim'), frameRate: 55, repeat: -1 });
            this.anims.create({ key: 'c6s', frames: this.anims.generateFrameNumbers('ExplosionAnim'), frameRate: 15, repeat: -1 });
            GameplayScene.anim_keys_inited = true;
        }
        this.object_pooler = new ObjectPooling(this);
        this.coins = []; this.line_particles = []; this.coin_slice_anims = []; this.x_strikes = 0; this.score = 0;
        this.bg = this.add.image(0, 0, 'Bg_Level' + GlobalAttributes.stage_selected);   this.bg.setOrigin(0,0);
        this.bg.setInteractive();
        this.bg.on('pointerdown', function() { this.pointer_event_f(1); }, this);
        this.bg.on('pointerup', function() { this.pointer_event_f(0); }, this);
        this.char = this.add.image(0,0, 'Char');  this.sword = this.add.image(0,0, 'Sword');
        this.char.visible = false; this.sword.visible = false;
        this.sword.setOrigin(0,1);
        var hud_top = this.add.image(0, 0, 'HUDTopBar');  hud_top.setOrigin(0,0);  hud_top.setDepth(1000);
        this.xs = [];
        for (this.i = 0; this.i < 3; this.i++)
        {
            var x = this.add.image(1111 + this.i * 55, 28, 'X');   
            x.setDepth(1001 + this.i);
            this.xs.push(x);
        }
        this.btn_pause = new CustomButton(this, 989, 4, 'PauseButton');  this.btn_pause.setDepth(1004);
        this.btn_menu = new CustomButton(this, 444, 6, 'MenuButton'); this.btn_menu.scale = 0.333; this.btn_menu.setDepth(1005);
        this.txt_score = this.add.text(15, 8, 'Score', 
                        { fontFamily: 'Arial', fontSize: '33px', fill: '#FFFFFF', stroke: '#222222', strokeThickness: 3});
        this.txt_timer = this.add.text(255, 8, '', 
                        { fontFamily: 'Arial', fontSize: '33px', fill: '#FFFFFF', stroke: '#222222', strokeThickness: 3});
        this.txt_score.setDepth(1006);  this.txt_timer.setDepth(1007);
        this.grey_screener = this.add.image(0, 0, 'GreyScreener');  this.grey_screener.setOrigin(0,0);
        this.grey_screener.scale = 100; this.grey_screener.setDepth(1008);
        this.spr_achievement_unlocked = this.add.sprite(160, 100, 'AchievementUnlocked');
        this.spr_achievement = new Achievement(this, 1);
        this.spr_achievement.x = this.spr_achievement_unlocked.x;  this.spr_achievement.y = this.spr_achievement_unlocked.y + 5;
        this.spr_achievement.scale = 0.88;
        this.spr_achievement_unlocked.setDepth(1111);  this.spr_achievement.setDepth(1112);
        this.start_up();
    }
    
    update()
    {  
        this.char_update();
        this.btn_menu.update();
        if (this.btn_menu.check_clicked())
        {
            this.back_to_menu();
            return;
        }
        this.btn_pause.update();
        if (this.btn_pause.check_clicked() && this.session_status == 0)
        {
            this.paused = !this.paused;
            this.grey_screener.alpha = (this.paused) ? 0.4 : 0.0;
        }
        if (this.paused) { return; }
        if (this.session_status == 0)
        {
            if (GlobalAttributes.game_mode == 0)
            {
                this.timer_frames_update();
            }
            this.timer_next_coin_ef();
            this.timer_max_swipe_length_checker_ef();
            this.new_line_particles();
        }
        else
        {
            this.session_concluded_update();
        }
        for (this.i = 0; this.i < Math.max(Math.max(this.coins.length,this.coin_slice_anims.length),this.line_particles.length); this.i++)
        {
            if (this.i < this.coins.length) { this.coins[this.i].update(); }
            if (this.i < this.line_particles.length) { this.line_particles[this.i].update(); }
            if (this.i < this.coin_slice_anims.length) { this.coin_slice_anims[this.i].update(); }
        }
    }

    pointer_event_f(type)
    {
        if (this.session_status != 0) { return; }
        if (type == 1)
        {
            this.timer_max_swipe_length_checker = this.t_mslc_r;
            this.touch_held = true;
            this.timer_new_line_particle = 0;
            this.touch_start_x = game.input.activePointer.x;  this.touch_start_y = game.input.activePointer.y;
            this.mrp_x = this.touch_start_x; this.mrp_y = this.touch_start_y;
            this.play_sound('snd_slice');
        }
        else
        {
            if (!this.touch_held) { return; }
            this.touch_held = false;
            this.check_slice();
        }
    }

    new_line_particles()
    {
        if (!this.touch_held) { return; }
        if (this.timer_new_line_particle > 0)
        {
            this.timer_new_line_particle--;
        }
        else
        {
            var dist = GlobalFunctions.dbp(this.mrp_x, this.mrp_y, game.input.activePointer.x, game.input.activePointer.y);
            if (dist < 13) { return; }
            var rep = 1;  var ang = -500;
            if (dist > 50)
            {
                rep = Math.ceil((dist - 50) / 50);
                ang = GlobalFunctions.abpr(this.mrp_x, this.mrp_y, game.input.activePointer.x, game.input.activePointer.y);
            }
            var ddd = dist / rep;
            for (this.i = 0; this.i < rep; this.i++)
            {
                var p = this.object_pooler.get_obj(1);
                if (this.i == rep - 1)
                {
                    p.x = game.input.activePointer.x;  p.y = game.input.activePointer.y;
                    this.mrp_x = p.x; this.mrp_y = p.y;
                }
                else
                {
                    p.x = this.mrp_x + Math.cos(ang) * ddd * (this.i + 1);  p.y = this.mrp_y + Math.sin(ang) * ddd * (this.i + 1);
                }
                p.setDepth(500);
                p.init();  this.line_particles.push(p);
            }
            this.timer_new_line_particle = this.t_nlp_r;
        }
    }

    check_slice()
    {
        for (this.j = 0; this.j < this.coins.length; this.j++)
        {
            if (this.coins[this.j].alpha < 1) { continue; }
            var num_colliders = 0;
            for (this.k = 0; this.k < this.line_particles.length; this.k++)
            {
                if (GlobalFunctions.circle_collision(this.coins[this.j].x, this.coins[this.j].y, 50,
                                                    this.line_particles[this.k].x, this.line_particles[this.k].y, 25))
                {
                    num_colliders++;
                    if (num_colliders >= 2)
                    {
                        if (!this.char.visible)
                        {
                            var dir = (Math.random() < 0.5) ? -1 : 1;
                            this.char.scaleX = -dir;  this.sword.scaleX = -dir;
                            this.char.x = this.coins[this.j].x + 100 * dir;
                            this.char.y = this.coins[this.j].y;
                            this.sword.x = this.char.x; this.sword.y = this.char.y;
                            this.sword.angle = 0;
                            this.char.visible = true;  this.sword.visible = true;
                            this.char.alpha = 1;  this.sword.alpha = 1;
                        }
                        if (this.coins[this.j].framezies == 5)
                        {
                            this.coins[this.j].alpha = 0.99;
                        }
                        else
                        {
                            var ca = this.object_pooler.get_obj(2);
                            ca.x = this.coins[this.j].x; ca.y = this.coins[this.j].y;
                            ca.angle = this.coins[this.j].angle;
                            ca.init(this.coins[this.j].framezies);
                            this.coin_slice_anims.push(ca);
                        }
                        if (this.coins[this.j].framezies != 6)
                        {
                            this.play_sound('snd_coin');
                            this.increase_score(this.coins[this.j].framezies == 5);
                        }
                        else
                        {
                            this.play_sound('snd_bomb');
                            if (this.x_strikes < 3)
                            {
                                this.inc_x_strikes();
                            }
                        }
                        if (this.coins[this.j].framezies != 5)
                        {
                            this.object_pooler.pool_obj(0, this.coins[this.j]);
                        }
                        break;
                    }
                }
            }
        }
    }

    increase_score(rainbow_coin, just_text_update = false)
    {
        if (!just_text_update)
        {
            this.score += (rainbow_coin) ? 10 : 1;
        }
        this.txt_score.text = "Score: " + this.score;
        if (GlobalAttributes.game_mode == 0)
        {
            this.txt_score.text += "/" + GameplayParams.points_needed_to_clear_level[GlobalAttributes.stage_selected - 1];
            if (this.score >= GameplayParams.points_needed_to_clear_level[GlobalAttributes.stage_selected - 1])
            {
                this.session_status = 1;
                this.panel = new LevelCompletePanel(this);  this.panel.setDepth(1010);
                var unlocked_achievement = 10;
                if (!GlobalAttributes.achievements_unlocked[0])
                {
                    unlocked_achievement = 0;
                }
                if (!GlobalAttributes.achievements_unlocked[1])
                {
                    if (GlobalAttributes.stage_selected == 10)
                    {
                        unlocked_achievement = 1;
                    }
                }
                if (!GlobalAttributes.achievements_unlocked[2])
                {
                    if (GlobalAttributes.stage_selected == 20)
                    {
                        unlocked_achievement = 2;
                    }
                }
                if (unlocked_achievement != 10)
                {
                    var item_key = 'a' + (unlocked_achievement + 1);
                    localStorage.setItem(item_key, "true");
                    GlobalAttributes.achievements_unlocked[unlocked_achievement] = true;
                    this.spr_achievement_unlocked.visible = true;
                    this.spr_achievement.setTexture('Achievement' + (unlocked_achievement + 1));
                    this.spr_achievement.visible = true;
                }
                this.panel.init();
            }
        }
    }

    inc_x_strikes()
    {
        if (this.x_strikes >= 3) { return; }
        this.xs[this.x_strikes].scale = 1;
        this.xs[this.x_strikes].setTintFill(0xFF5533);
        this.x_strikes++;
        if (this.x_strikes >= 3)
        {
            this.trigger_retry();
        }
    }

    continue_next_level()
    {
        if (GlobalAttributes.stage_selected < GameplayParams.points_needed_to_clear_level.length)
        {
            GlobalAttributes.stage_selected++;
            this.bg.setTexture('Bg_Level' + GlobalAttributes.stage_selected); //;)
            this.restart();
        }
    }

    restart()
    {
        this.play_sound('snd_button');
        this.panel.visible = false;
        this.start_up();
    }

    trigger_retry()
    {
        console.log("Trigger retry: " + GlobalAttributes.game_mode);
        if (GlobalAttributes.game_mode == 1)
        {
            if (this.score > GlobalAttributes.best_score)
            {
                localStorage.setItem('best_score', this.score);
                GlobalAttributes.best_score = this.score;
            }
            console.log("Astusa");
            var unlocked_achievement_yo = 10;
            if (!GlobalAttributes.achievements_unlocked[3])
            {
                console.log("score: " + this.score);
                if (this.score >= 100)
                {
                    unlocked_achievement_yo = 3;
                    GlobalAttributes.achievements_unlocked[3] = true;
                }
            }
            if (!GlobalAttributes.achievements_unlocked[4])
            {
                if (this.score >= 300)
                {
                    unlocked_achievement_yo = 4;
                    GlobalAttributes.achievements_unlocked[4] = true;
                }
            }
            if (unlocked_achievement_yo != 10)
            {
                var ik = 'a' + (unlocked_achievement_yo + 1);
                localStorage.setItem(ik, "true");
                this.spr_achievement_unlocked.visible = true;
                this.spr_achievement.setTexture('Achievement' + (unlocked_achievement_yo + 1));
                this.spr_achievement.visible = true;
            }
        }
        this.session_status = 2;
        this.panel = new RetryPanel(this);  this.panel.setDepth(1009);
        this.panel.init();
    }

    start_up()
    {
        this.timer_frames = 60;
        this.spr_achievement_unlocked.visible = false; this.spr_achievement.visible = false;
        if (GlobalAttributes.game_mode == 0)
        {
            this.time_left = GameplayParams.level_timer[GlobalAttributes.stage_selected - 1];
            this.update_time_left_text();
            this.burst_throw_max = GameplayParams.burst_throw_amount[GlobalAttributes.stage_selected - 1];
        }
        else
        {
            this.burst_throw_max = 1;
            this.t_nc_r = 100;
        }
        this.grey_screener.alpha = 0;
        this.score = 0; this.x_strikes = 0;
        this.session_status = 0;
        this.increase_score(false, true);
        for (this.i = this.coins.length - 1; this.i >= 0; this.i--)
        {
            this.object_pooler.pool_obj(0, this.coins[this.i]);
        }
        for (this.i = this.coin_slice_anims.length - 1; this.i >= 0; this.i--)
        {
            this.object_pooler.pool_obj(2, this.coin_slice_anims[this.i]);
        }
        for (this.i = 0; this.i < 3; this.i++)
        {
            this.xs[this.i].setScale(0.63);
            this.xs[this.i].setTintFill(0x333333);
        }
    }

    char_update()
    {
        if (this.char.visible)
        {
            if (this.sword.angle < 111)
            {
                this.sword.angle += 7;
            }
            else
            {
                if (this.char.alpha > 0.1)
                {
                    this.char.alpha -= 0.03;  this.sword.alpha -= 0.03;
                }
                else
                {
                    this.char.visible = false;  this.sword.visible = false;
                }
            }
        }
    }

    session_concluded_update()
    {
        if (this.grey_screener.alpha < 1)
        {
            this.grey_screener.alpha = Math.min(0.4, this.grey_screener.alpha + 0.03);
        }
        this.panel.update();
    }

    //Timers
    //
        update_time_left_text()
        {
            this.txt_timer.text = this.time_left + "s";
        }
        timer_frames_update()
        {
            if (this.timer_frames > 0)
            {
                this.timer_frames--;
            }
            else
            {
                this.time_left--;
                this.update_time_left_text();
                if (this.time_left == 0)
                {
                    for (this.i = 0; this.i < this.xs.length; this.i++)
                    {
                        this.xs[this.i].setScale(1);
                        this.xs[this.i].setTintFill(0xFF5533);
                    }
                    this.trigger_retry();
                    return;
                }
                this.timer_frames = 60;
            }
        }
        timer_max_swipe_length_checker_ef()
        {
            if (this.touch_held)
            {
                if (this.timer_max_swipe_length_checker > 0)
                {
                    this.timer_max_swipe_length_checker--;
                }
                else
                {
                    this.touch_held = false;
                    this.check_slice();
                }
            }
        }

        timer_next_coin_ef()
        {
            if (this.timer_next_coin > 0)
            {
                this.timer_next_coin--;
            }
            else
            {
                this.timer_next_coin = (GlobalAttributes.game_mode == 0) ? GameplayParams.new_fruit_timer_reset[GlobalAttributes.stage_selected - 1] : this.t_nc_r;
                if (GlobalAttributes.game_mode == 1)
                {
                    this.t_nc_r = Math.max(30, this.t_nc_r - 0.5);
                    this.burst_throw_max += 0.1;
                }
                var upto = 1 + Math.floor(Math.random() * (this.burst_throw_max - 1));
                for (this.i = 0; this.i < upto; this.i++)
                {
                    var coin = this.object_pooler.get_obj(0);
                    this.coins.push(coin);
                    coin.launch();
                }
            }
        }
    //

    back_to_menu()
    {
        this.scene.pause('GS');
        this.scene.start('MS');
    }

    //Audio
    //
        play_sound(snd)
        {
            if (GlobalAttributes.sounds)
            {
                this.sound.play(snd);
            }
        }
    //

}
