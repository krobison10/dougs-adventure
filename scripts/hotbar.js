
 class Hotbar extends Entities {
                    constructor(player) {
                        super(new Vec2(0, 0), new Dimension(0, 0));
                        this.agent = agent;
                        this.width = 40;
                        this.height = 20;
                        this.offset = this.player.size.w - this.width;
                        this.innerPadding = 5;
                    }
                
                    update() {
                        // update the state of the hotbar
                   //this.selectedItem = this.agent.getSelectedItem();
                    }
                
                    draw(ctx) {
                        let screenPos = this.agent.getScreenPos();
                
                        ctx.fillStyle = rgba(50, 50, 50, 0.7);
                        ctx.fillRect(screenPos.x + this.offset / 2 + this.innerPadding,
                            screenPos.y + this.agent.size.h + this.innerPadding,
                            this.width - 2 * this.innerPadding, this.height - 2 * this.innerPadding);
                
                        // Draw the items in the hotbar
                        for(let i = 0; i < this.agent.hotbar.length; i++) {
                            let item = this.agent.hotbar[i];
                            let x = screenPos.x + this.offset / 2 + (i * this.width / this.agent.hotbar.length);
                            let y = screenPos.y + this.agent.size.h;
                            ctx.drawImage(item.image, x, y, this.width / this.agent.hotbar.length, this.height);
                        }
                
                        ctx.strokeStyle = rgba(40, 40, 40, 1);
                        ctx.lineWidth = '2.5';
                
                        ctx.strokeRect(screenPos.x + this.offset / 2, screenPos.y + this.agent.size.h,
                            this.width, this.height);
                    }
                }


