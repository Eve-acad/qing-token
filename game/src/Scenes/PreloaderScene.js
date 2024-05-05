class PreloaderScene extends Phaser.Scene
{
    
    additional_load_timer = 55;//1 * 60;

    constructor()
    {
        super('PS');
    }

    preload()
    {
        var loading_text = this.add.text(477, 222, 'Loading...', 
                        { fontFamily: 'Arial', fontSize: '77px', fill: '#FFFFFF', stroke: '#222222', strokeThickness: 3});
        //Menu
        //
            this.load.image('PlayButton', 'assets/PlayButton.png'); this.load.image('LevelSelectButton', 'assets/LevelSelectButton.png');
            this.load.image('LevelModeButton', 'assets/LevelModeButton.png'); this.load.image('EndlessModeButton', 'assets/EndlessModeButton.png');
            this.load.image('BackButton', 'assets/BackButton.png'); this.load.image('SoundsButton', 'assets/SoundsButton.png');
            this.load.image('FullScreenButton', 'assets/FullScreenButton.png'); this.load.image('MusicButton', 'assets/MusicButton.png');
        //
        //BG
        //
            this.load.image('Bg_Menu', 'assets/Bg_Menu.png');
            this.load.image('Bg_Level1', 'assets/Bg_Level1.png'); this.load.image('Bg_Level2', 'assets/Bg_Level2.png');
            this.load.image('Bg_Level3', 'assets/Bg_Level3.png'); this.load.image('Bg_Level4', 'assets/Bg_Level4.png');
            this.load.image('Bg_Level5', 'assets/Bg_Level5.png'); this.load.image('Bg_Level6', 'assets/Bg_Level6.png');
            this.load.image('Bg_Level7', 'assets/Bg_Level7.png'); this.load.image('Bg_Level8', 'assets/Bg_Level8.png');
            this.load.image('Bg_Level9', 'assets/Bg_Level9.png'); this.load.image('Bg_Level10', 'assets/Bg_Level10.png');
            this.load.image('Bg_Level11', 'assets/Bg_Level11.png'); this.load.image('Bg_Level12', 'assets/Bg_Level12.png');
            this.load.image('Bg_Level13', 'assets/Bg_Level13.png'); this.load.image('Bg_Level14', 'assets/Bg_Level14.png');
            this.load.image('Bg_Level15', 'assets/Bg_Level15.png'); this.load.image('Bg_Level16', 'assets/Bg_Level16.png');
            this.load.image('Bg_Level17', 'assets/Bg_Level17.png'); this.load.image('Bg_Level18', 'assets/Bg_Level18.png');
            this.load.image('Bg_Level19', 'assets/Bg_Level19.png'); this.load.image('Bg_Level20', 'assets/Bg_Level20.png');
        //
        
        //Gameplay
        //
            //Coins
            //
                this.load.image('Coin1', 'assets/Coin1.png'); this.load.image('Coin2', 'assets/Coin2.png');
                this.load.image('Coin3', 'assets/Coin3.png'); this.load.image('Coin4', 'assets/Coin4.png');
                this.load.image('Coin5', 'assets/Coin5.png'); 
                this.load.image('bomb', 'assets/bomb.png');
                this.load.spritesheet("Coin1SliceAnim", "assets/Coin1SliceAnim.png", {frameWidth: 266, frameHeight: 271} );
                this.load.spritesheet("Coin2SliceAnim", "assets/Coin2SliceAnim.png", {frameWidth: 266, frameHeight: 271} );
                this.load.spritesheet("Coin3SliceAnim", "assets/Coin3SliceAnim.png", {frameWidth: 266, frameHeight: 271} );
                this.load.spritesheet("Coin4SliceAnim", "assets/Coin4SliceAnim.png", {frameWidth: 266, frameHeight: 271} );
                this.load.spritesheet("ExplosionAnim", "assets/ExplosionAnim.png", {frameWidth: 130, frameHeight: 130} );
            //
            this.load.image('Char', 'assets/char.png');  this.load.image('Sword', 'assets/sword.png');
            this.load.image('LineParticle', 'assets/LineParticle.png');
        //
        
        //HUD
        //
            this.load.image('HUDTopBar', 'assets/HUDTopBar.png');
            this.load.image('X', 'assets/X.png');
            this.load.image('GreyScreener', 'assets/GreyScreener.png');
            this.load.image('LevelCompletePanel', 'assets/LevelCompletePanel.png'); this.load.image('RetryPanel', 'assets/RetryPanel.png');
            this.load.image('ContinueButton', 'assets/ContinueButton.png'); this.load.image('RetryButton', 'assets/RetryButton.png');
            this.load.image('MenuButton', 'assets/MenuButton.png'); this.load.image('PauseButton', 'assets/PauseButton.png');
            this.load.image('AchievementsButton', 'assets/AchievementsButton.png'); this.load.image('ClearSaveDataButton', 'assets/ClearSaveDataButton.png');
        //
        
        //Music
            this.load.audio('bgm', 'assets/bgm.mp3');
        
        //Sfx
        //
            this.load.audio('snd_coin', 'assets/Coin.wav'); this.load.audio('snd_slice', 'assets/Slice.wav'); this.load.audio('snd_bomb', 'assets/Bomb.wav');
            this.load.audio('snd_win', 'assets/Win.wav'); this.load.audio('snd_retry', 'assets/Retry.wav');
            this.load.audio('snd_button', 'assets/Button.wav');
        //
        
        //Achievements
        //
            this.load.image('AchievementUnlocked', 'assets/AchievementUnlocked.png');
            this.load.image('Achievement1', 'assets/Achievement1.png'); this.load.image('Achievement2', 'assets/Achievement2.png');
            this.load.image('Achievement3', 'assets/Achievement3.png'); this.load.image('Achievement4', 'assets/Achievement4.png');
            this.load.image('Achievement5', 'assets/Achievement5.png');
        //
    }

    create()
    {
        this.sound.play('bgm', {loop: true}); 
        
        var sd_sr = localStorage.getItem('stage_reached');
        if (sd_sr != null) { GlobalAttributes.stage_reached = parseInt(sd_sr); }
        
        var sd_best_score = localStorage.getItem('best_score');
        if (sd_best_score != null) { GlobalAttributes.best_score = parseInt(sd_best_score); }
        
        var sd_a1 = localStorage.getItem('a1');
        if (sd_a1 != null && sd_a1 != "false") { GlobalAttributes.achievements_unlocked[0] = true; }
        
        var sd_a2 = localStorage.getItem('a2');
        if (sd_a2 != null && sd_a2 != "false") { GlobalAttributes.achievements_unlocked[1] = true; }
        
        var sd_a3 = localStorage.getItem('a3');
        if (sd_a3 != null && sd_a3 != "false") { GlobalAttributes.achievements_unlocked[2] = true; }
        
        var sd_a4 = localStorage.getItem('a4');
        if (sd_a4 != null && sd_a4 != "false") { GlobalAttributes.achievements_unlocked[3] = true; }
        
        var sd_a5 = localStorage.getItem('a5');
        if (sd_a5 != null && sd_a5 != "false") { GlobalAttributes.achievements_unlocked[4] = true; }
    }
    
    update()
    {
        if (this.additional_load_timer > 0)
        {
            this.additional_load_timer--;
        }
        else
        {
            //this.scene.start('GS');
            this.scene.start('MS');
        }
    }
    
}
