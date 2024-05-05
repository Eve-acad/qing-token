class ObjectPooling
{
    
    coins_pool = [];  line_particles_pool = [];  coin_slice_anims_pool = [];
    scene;

    constructor(scene)
    {
        this.scene = scene;
    }

    get_obj(type)
    {
        //console.log("get new object type " + type);
        var obj;
        var ref_pool;  var ref_type;
        switch (type)
        {
            case 0:
                ref_pool = this.coins_pool;
                ref_type = Coin;
                break;
            case 1:
                ref_pool = this.line_particles_pool;
                ref_type = LineParticle;
                break;
            case 2:
                ref_pool = this.coin_slice_anims_pool;
                ref_type = CoinSliceAnim;
                break;
        }
        
        if (ref_pool.length == 0)
        {
            obj = new ref_type(this.scene);
            //console.log("Creating new");
        }
        else
        {
            //console.log("Reusing");
            obj = ref_pool[0];
            ref_pool.splice(0, 1);
        }
        return obj;
    }

    pool_obj(type, instance)
    {
        instance.visible = false;
        var ref_pool;  var ref_a;
        switch (type)
        {
            case 0:
                ref_pool = this.coins_pool;
                ref_a = this.scene.coins;
                break;
            case 1:
                ref_pool = this.line_particles_pool;
                ref_a = this.scene.line_particles;
                break;
            case 2:
                ref_pool = this.coin_slice_anims_pool;
                ref_a = this.scene.coin_slice_anims;
                break;
        }
        ref_pool.push(instance);
        ref_a.splice(ref_a.indexOf(instance), 1);
    }

}
