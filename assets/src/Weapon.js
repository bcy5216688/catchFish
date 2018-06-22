
cc.Class({
    extends: cc.Component,

    properties: {
        anim_weapon: {
            default: null,
            type: cc.Animation,
        },
    },

    onLoad () {
        this.curLevel = 1;
        this.total = this.anim_weapon.getClips().length;
    },

    // update (dt) {},
    plus () {
        if (this.curLevel + 1 > this.total) {
            this.curLevel = this.total;
        } else {
            this.curLevel++;
        }
        this.anim_weapon.play('weapon_level_' + this.curLevel);
    },

    reduce () {
        if (this.curLevel < 2) {
            this.curLevel = 1;
        } else {
            this.curLevel--;
        }
        this.anim_weapon.play('weapon_level_' + this.curLevel);
    },
});
