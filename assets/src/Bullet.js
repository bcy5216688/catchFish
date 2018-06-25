cc.Class({
    extends: cc.Component,

    properties: {
        speed: 80,
        angle: 0,         // 子弹初始角度  
        attack: 10,        // 子弹攻击力，基础攻击力
        bulletLevel: 1,   // 子弹等级
    },

    onLoad () {      

    },

    shot (game, level) { 
        this.game = game;
        // 启动update函数
        this.enabled = true;
        var weaponSite = game.weaponNode.parent.convertToWorldSpaceAR(game.weaponNode.getPosition());
        this.angle = game.weaponNode.rotation;
        this.node.rotation = this.angle;
        var bpos = cc.p(weaponSite.x + 50 * Math.sin(this.angle / 180 * 3.14), weaponSite.y + 50 * Math.cos(this.angle / 180 * 3.14));
        this.setBullet(level);
        this.node.position = bpos;
        this.node.parent = game.weaponLayer;
    },

    // 根据武器等级设置子弹等级
    setBullet (level) {
        this.bulletLevel = level;
        // this.node.getComponent(cc.Sprite).spriteFrame = this.game.atlas_spr.getSpriteFrame('bullet' + this.bulletLevel);
    },

    update (dt) {
        var bx = this.node.x;
        var by = this.node.y;
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
        switch (other.tag) {
            case 1:
                this.bulletLeftSceneCollision(other, self);
                break;
            case 2:
                this.bulletRightSceneCollision(other, self);
                break;
            case 3:
                this.bulletUpSceneCollision(other, self);
                break;
            case 4:
                this.bulletDownSceneCollision(other, self);
                break;
            case 5:
                this.bulletFishCollision(other, self);
                break;
        }
    },

    bulletLeftSceneCollision (other, self) {
        // cc.log("collision left");
        this.angle = -this.angle;
        this.node.rotation = this.angle;
    },

    bulletRightSceneCollision (other, self) {
        // cc.log("collision right");
        this.angle = -this.angle;
        this.node.rotation = this.angle;
    },

    bulletUpSceneCollision (other, self) {
        // cc.log("collision up");
        this.angle = 180 - this.angle;
        this.node.rotation = this.angle;
    },

    bulletDownSceneCollision (other, self) {
        // cc.log("collision down");
        this.angle = 180 - this.angle;
        this.node.rotation = this.angle;
    },

    bulletFishCollision (other, self) {
        // 矩形碰撞组件顶点坐标，左上，左下，右下，右上
        var posb = self.world.points;
        // 取左上和右上坐标计算中点当做碰撞中点
        var posNet = cc.pMidpoint(posb[0], posb[3]);
        this.game.createNet(posNet);
        this.game.despawnBullet(this.node);
    },

    getAttackValue () {
        return this.attack * this.bulletLevel;
    },
});
