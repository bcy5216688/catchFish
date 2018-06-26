
cc.Class({
    extends: cc.Component,

    properties: {
        prefab_bullet: {
            default: null,
            type: cc.Prefab,
        },
        prefab_weapon: {
            default: null,
            type: cc.Prefab,
        },
        prefab_fish: {
            default: null,
            type: cc.Prefab,
        },
        prefab_net: {
            default: null,
            type: cc.Prefab,
        },
        atlas_spr: {
            default: null,
            type: cc.SpriteAtlas,
        },
    },

    onLoad () {
        var collisionMgr = cc.director.getCollisionManager();
        collisionMgr.enabled = true;
        // collisionMgr.enabledDebugDraw = true;

        this.getNode();
        this.initWeapon();
        this.addTouchEvent();

        this.bulletPool = new cc.NodePool();
        this.fishPool = new cc.NodePool();
        this.initFishPool();
        this.netPool = new cc.NodePool();
        this.loadFishConfig();
    },

    getNode () {
        this.weaponLayer = this.node.getChildByName("layer_weapon");
        this.netLayer = this.node.getChildByName("layer_net");
        this.fishLayer = this.node.getChildByName("layer_fish");
        this.coinLayer = this.node.getChildByName("layer_coin");
    },

    initFishPool () {
        var initCount = 10;
        for (var i = 0; i < initCount; ++i){
            var fishNode = cc.instantiate(this.prefab_fish);
            this.fishPool.put(fishNode);
        }
    },

    loadFishConfig () {
        cc.loader.loadRes("fishconfig", function (err, data) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            this.fishTypes = data;
            this.schedule(this.creatFish, 2);
        }.bind(this));
    },

    addTouchEvent () {
        // 添加触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) { 
            //需要将触点坐标转换成局部坐标，跟炮台一致
            var touchPos = event.touch._point;
            var weaponPos = this.weaponNode.parent.convertToWorldSpaceAR(this.weaponNode.getPosition());
            if (touchPos.y < weaponPos.y) 
                return;
            var radian = Math.atan((touchPos.x - weaponPos.x) / (touchPos.y - weaponPos.y));
            var degree = radian * 180 / 3.14;
            this.weaponNode.rotation = degree;
            var curPower = this.weaponNode.parent.getComponent("Weapon").curPower;
            this.shot(curPower);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // cc.log('touch move');
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // cc.log('touch end');
        }, this);
    },

    initWeapon () {
        var weaponPosArr = [cc.p(384,0), cc.p(896,0), cc.p(896,720), cc.p(384,720)];
        for (var i = 0; i < weaponPosArr.length; i++) {
            var weaponBaseNode = cc.instantiate(this.prefab_weapon);
            weaponBaseNode.parent = this.weaponLayer;
            weaponBaseNode.position = weaponPosArr[i];
            if (i === 0) {
                this.weaponNode = weaponBaseNode.getChildByName("spr_weapon");
            }

            if (i === 2 || i === 3) {
                weaponBaseNode.rotation = 180;
            }

            var scriptWeaponScript = weaponBaseNode.getComponent("Weapon");
            scriptWeaponScript.setGameControl(this);
            scriptWeaponScript.initInfoNode(i);
        }
    },

    shot (curPower) {
        var bullet = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.prefab_bullet);
        }

        var bulletScript = bullet.getComponent("Bullet");
        bulletScript.shot(this, curPower);
    },

    creatFish () {        
        var fishCount = 3;
        for (var i = 0; i < fishCount; ++i) {
            var fishNode = null; 
            if (this.fishPool.size() > 0) {
                fishNode = this.fishPool.get();
            } else {
                fishNode = cc.instantiate(this.prefab_fish); 
            }
            fishNode.getComponent("Fish").init(this);
        }  
    },

    createNet (position) {
        var netNode = null;
        if (this.netPool.size() > 0) {
            netNode = this.netPool.get();
        } else {
            netNode = cc.instantiate(this.prefab_net);
        }
        var bulletLevel = this.weaponNode.parent.getComponent("Weapon").curLevel;
        netNode.getComponent("Net").init(position,this,bulletLevel);
    },

    despawnBullet (bullet) {
        this.bulletPool.put(bullet);
    },

    despawnFish (fish) {
        this.fishPool.put(fish);
    },

    despawnNet(net) {
        this.netPool.put(net);
    },

    // update (dt) {},
});
