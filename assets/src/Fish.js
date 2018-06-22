
cc.Class({
    extends: cc.Component,

    properties: {
        anim_fish: {
            default: null,
            type: cc.Animation,
        },
    },

    init (game) {
        this.hp = 10;  // Health point 血量 默认10
        this.gold = 2; // gold 打死掉落金币数量
        this.fishState = 1, // fish state 鱼的生命状态，默认都是活的 1是活  0是死
        this.lastPosition = cc.p(0,0);   // 保存上一次坐标,用于更新角度
        this.fishType = null;
        this.startTime = Date.now(),
        this.time = 0;

        var bezier1 = [cc.p(50, -100), cc.p(300, -400), cc.p(1800, -650)];
        var bezier2 = [cc.p(100, -200), cc.p(400, -300), cc.p(1800, -600)];
        var bezier3 = [cc.p(150, -300), cc.p(600, -400), cc.p(1800, -500)];
        var bezier4 = [cc.p(50, 50), cc.p(400, 100), cc.p(1800, 200)];
        var bezier5 = [cc.p(80, 200), cc.p(300, 500), cc.p(1800, 650)];
        var bezier6 = [cc.p(100, 100), cc.p(350, 400), cc.p(1800, 500)];
        var bezier7 = [cc.p(100, 2), cc.p(350, -2), cc.p(1800, 0)];
        this.bezierArray = new Array();

        this.bezierArray.push(bezier1);
        this.bezierArray.push(bezier2);
        this.bezierArray.push(bezier3);
        this.bezierArray.push(bezier4);
        this.bezierArray.push(bezier5);
        this.bezierArray.push(bezier6);
        this.bezierArray.push(bezier7);
        this.game = game;
        this.enabled = true;
        this.spawnFish(game);
    },

    spawnFish (game) {
        let fishStr = game.fishTypes.length;
        let randomFish = Math.floor(cc.random0To1() * fishStr);
        this.fishType = game.fishTypes[randomFish];
        let pos = cc.p(-cc.random0To1() * 100 - 200, cc.randomMinus1To1() * 300 + 350);
        this.node.position = pos;
        let index = Math.floor(cc.random0To1() * this.bezierArray.length);
        let bezier = this.bezierArray[index];
        // 贝塞尔曲线第一个控制点，用来计算初始角度
        let firstp = bezier[0];
        let k = Math.atan((firstp.y) / (firstp.x));
        this.node.rotation = -k * 180 / 3.14;
        this.node.getComponent(cc.Sprite).spriteFrame = this.game.atlas_spr.getSpriteFrame(this.fishType.name + '_run_0');
        // 取出鱼的血量
        this.hp = this.fishType.hp;
        // 掉落金币
        this.gold = this.fishType.gold;
        this.fishState = 1;
        this.anim_fish.play(this.fishType.name + '_run');
        // 加到canvas节点下才可以设置zorder
        // 默认zorder为0，bg设为-1，炮台设为1
        this.node.parent = game.fishLayer;
        this.lastPosition = this.node.getPosition();
        // this.changeCollider();
        this.fishRun(bezier);
    },

    // 重新设置碰撞区域
    changeCollider () {
        let collider = this.node.getComponent(cc.BoxCollider);
        collider.size = this.node.getContentSize();
    },

    // 鱼走贝塞尔曲线
    fishRun (trace) {
        let windowSize = cc.director.getWinSize();
        let speed = cc.random0To1() * 10 + 10;
        let bezerby = cc.bezierBy(speed, trace);
        this.node.runAction(bezerby);
    },

    update (dt) {
        this.updateDegree();
    },

    // 更新鱼的角度
    updateDegree () {
        let currentPos = this.node.getPosition();
        // 如果位移不超过1，不改变角度
        if (cc.pDistance(this.lastPosition, currentPos) < 1) {
            return;
        }

        // 计算角度
        let degree;
        if (currentPos.x - this.lastPosition.x == 0) {
            // 垂直
            if (currentPos.y - this.lastPosition.y > 0) {
                degree = -90;
            } else {
                degree = 90;
            }
        } else {
            degree = - Math.atan((currentPos.y - this.lastPosition.y) / (currentPos.x - this.lastPosition.x)) * 180 / 3.14;
        }
        this.node.rotation = degree;
        this.lastPosition = currentPos;
        // this.despawnFish();
        this.beAttack();
    },

    beAttack () {
        if (this.isDie()) {
            // 停止贝塞尔曲线动作
            this.node.stopAllActions();
            //播放死亡动画
            let animState = this.anim_fish.play(this.fishType.name + '_die');
            // 被打死的动画播放完成之后回调
            animState.on('stop', this.dieCallback, this);
            // 播放金币动画
            // 转为世界坐标
            // let fp = this.node.parent.convertToWorldSpaceAR(this.node.position);
            // this.game.gainCoins(fp, this.gold);
        } else {
            // 跑出屏幕的鱼自动回收
            this.despawnFish();
        }
    },

    dieCallback () {
        // 死亡动画播放完回收鱼
        this.node.stopAllActions();
        this.game.despawnFish(this.node);
    },

    despawnFish () {
        if (this.node.x > cc.director.getWinSize().width + 100
            || this.node.x < -1000
            || this.node.y > cc.director.getWinSize().height + 100
            || this.node.y < -500
        ) {
            // this.node.removeFromParent();
            // 可以不移除节点，停止所有动作也可以完成
            this.node.stopAllActions();
            this.game.despawnFish(this.node);
        }
    },

    // 碰撞检测，鱼被打死的逻辑
    isDie () {
        if (this.fishState === 0) {
            return true;
        }
        return false;
    },

    onCollisionEnter (other, self) {
        let bullet = other.node.getComponent("Bullet");
        this.hp -= bullet.getAttackValue();
        if (this.hp <= 0) {
            this.fishState = 0;
        }  
    },
});
