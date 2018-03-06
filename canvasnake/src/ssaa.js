
/*global updateSSAAMenuItem*/

import { render } from './view.js';



export const SSAA = {
    current: 1,
    default: 1,
    MIN: 1,
    MAX: 4,
    
    set: function() {
        if (window.game.state.running) {
            window.reScaleGame(window.game.ui, this.current);
        }
        updateSSAAMenuItem(this.current);  // Update the SSAA menu item.
        render(window.game, true);
    },
    
    increment: function() {
        if (this.current === this.MAX) {
            this.current = this.MIN;
        } else {
            this.current *= 2;
        }
        this.set();
    },
    
    decrement: function() {
        if (this.current === this.MIN) {
            this.current = this.MAX;
        } else {
            this.current /= 2;
        }
        this.set();
    }
    
};
