class LevelSelectButton extends CustomButton
{
    
    num; 
    tf;

    constructor(scene, x, y)
    {
        super(scene, x, y, 'LevelSelectButton');
    }
    
    set_num(n)
    {
        this.num = n;
        this.tf = this.scene.add.text(this.x + 39 - ( (n >= 10) ? 9 : 0 ), this.y + 25, this.num, 
                        { fontFamily: 'Arial', fontSize: '33px', fill: '#FFFFFF', stroke: '#222222', strokeThickness: 3});
    }

}
