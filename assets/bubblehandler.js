class BubbleHandler {

	constructor() {
		this.color_scheme = ["#FF0000", "#00FF00", "#0000FF", "#FF00FF", "#FFFF00"];
		this.bubble_index = 0;
		this.requestAnimationFrame(this.animate);
		this.addBubble(0);
	}

	addBubble(classifier_index){
		let bubble_elem = document.createElement("div");
		bubble_elem.classList.add("bubble");
		bubble_elem.style.marginRight = 0;
		bubble_elem.alpha = 0;
		bubble_elem.id = "bindex" + bubble_index;
		document.querySelector('#bubbles').prepend(bubble_elem);
		
		//Add new bubble
		var coords = { mr: 0, alpha: 1, color: 0 }; // Start at (0, 0)
			new TWEEN.Tween(coords).to({ mr: 13, alpha: 0, color: 1 }, 800).easing(TWEEN.Easing.Bounce.Out)
			.onUpdate((object)=> { bubble_elem.style.marginRight = coords.mr + '%'; }).start();
		
		//Color previous bubble (if not first added bubble) based on classification
		if(bubble_index>0) {
			bubble_index_hold = bubble_index;
			console.log(document.getElementById("bindex" + (bubble_index_hold-1)));
			new TWEEN.Tween(coords).to({ color: 1 }, 800).easing(TWEEN.Easing.Bounce.Out).onUpdate(()=>{ document.getElementById("bindex" + (bubble_index_hold-1)).style.backgroundColor = this.lerpColor("#555555", color_scheme[classifier_index], coords.color); }).start();
		}
		
		if(document.querySelectorAll(".bubble").length >= 6) {
				let bubbles = document.querySelectorAll(".bubble");
				bubble_to_delete = bubbles[bubbles.length-1];
			new TWEEN.Tween(coords).to({ alpha: 0 }, 500).easing(TWEEN.Easing.Bounce.Out)
			.onComplete(()=>{ bubble_to_delete.parentNode.removeChild(bubble_to_delete); })
				.onUpdate((object)=> { 
				bubble_to_delete.style.opacity = coords.alpha;
				let deleted_mr = (13 - coords.mr);
				bubble_to_delete.style.marginRight = deleted_mr + "%"; 
			}).start();
		}

		bubble_index++;
	}

	animate(time) {
	requestAnimationFrame(animate);
		TWEEN.update(time);
	}

	lerpColor(a, b, amount) { 

		var ah = parseInt(a.replace(/#/g, ''), 16),
			ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
			bh = parseInt(b.replace(/#/g, ''), 16),
			br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
			rr = ar + amount * (br - ar),
			rg = ag + amount * (bg - ag),
			rb = ab + amount * (bb - ab);

		return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
	}
}