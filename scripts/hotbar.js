 class Hotbar extends Entity {
    constructor() {
        super(new Vec2(10, 10), new Dimension(40, 40));
        this.innerPadding = 5;
    }
                
    update() {
        //update the state
        //this.selectedItem = this.agent.getSelectedItem();
    }
                
    draw(ctx) {
        ctx.fillStyle = rgba(50, 50, 50, 0.7);
        ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

        // // Draw the items in the hotbar, hotbar not yet implemented in player
        // for(let i = 0; i < this.agent.hotbar.length; i++) {
        //     let item = this.agent.hotbar[i];
        //     let x = this.pos.x + this.innerPadding;
        //     let y = this.pos.y + this.innerPadding;
        //     ctx.drawImage(item.image, x, y, this.size.w - 2 * this.innerPadding, this.size.h - 2 * this.innerPadding);
        // }
               
        ctx.strokeStyle = rgba(40, 40, 40, 1);
        ctx.lineWidth = '2.5';
                
        ctx.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
}

