cc.Class({
    extends: cc.Component,

    properties: {
        speed: 80,
        angle: 0,         // 子弹初始角度  
        game: null,
        attack: 10,        // 子弹攻击力，基础攻击力
        bulletLevel: 1,   // 子弹等级
    },

    onLoad () {      

    },

    shot (game, level) { 
        this.game = game;
        // 启动update函数
        this.enabled = true;
        let weaponSite = game.weaponNode.getPosition();
        this.angle = game.weaponNode.rotation;
        this.node.rotation = this.angle;
        let bpos = cc.p(weaponSite.x + 50 * Math.sin(this.angle / 180 * 3.14), weaponSite.y + 50 * Math.cos(this.angle / 180 * 3.14));
        this.setBullet(level);
        this.node.position = bpos;
        this.node.parent = game.weaponLayer;
    },

    // 根据武器等级设置子弹等级
    setBullet (level) {
        this.bulletLevel = level;
        this.node.getComponent(cc.Sprite).spriteFrame = this.game.atlas_spr.getSpriteFrame('bullet' + this.bulletLevel);
    },

    update (dt) {
        let bx = this.node.x;
        let by = this.node.y;
        bx += dt * this.speed * Math.sin(this.angle / 180 * 3.14);
        by += dt * this.speed * Math.cos(this.angle / 180 * 3.14);
        this.node.x = bx;
        this.node.y = by;

        if (this.node.x > cc.director.getWinSize().width + 100
            || this.node.x < -100
            || this.node.y > cc.director.getWinSize().height + 100
            || this.node.y < 0
        ) {
            this.game.despawnBullet(this.node);
        }
    },

    onCollisionEnter (other, self) {
        // 矩形碰撞组件顶点坐标，左上，左下，右下，右上
        let posb = self.world.points;
        // 取左上和右上坐标计算中点当做碰撞中点
        let posNet = cc.pMidpoint(posb[0], posb[3]);
        this.game.createNet(posNet);
        this.game.despawnBullet(this.node);
    },

    getAttackValue () {
        return this.attack * this.bulletLevel;
    },
});
