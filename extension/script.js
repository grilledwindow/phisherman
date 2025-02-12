let popup;
window.addEventListener('load', async () => {
    popup = document.createElement('div');
    popup.id = 'p1';
    popup.style.display = 'none';

    if (document.readyState == 'complete') {
        let targets = {};
        let body = document.getElementById(':1');
        
        body.appendChild(popup);
        body.addEventListener('mouseover', (event) => {
            let target = event.target;

            // covers e.g. <a><img></a>
            if (target.parentElement instanceof HTMLAnchorElement) {
                target = target.parentElement;
            }

            if (!(target instanceof HTMLAnchorElement) || !target.hasAttribute('href')) {
                popup.style.display = 'none';
                return;
            } else if (target.id && targets.hasOwnProperty(target.id)) {
                let rect = target.getBoundingClientRect();
                let targetX = rect.left;
                let targetY = rect.top;
                console.log(targetX, targetY);

                popup.style.display = 'block';
                popup.style.position = 'absolute';
                popup.style.left = targetX + 'px';
                popup.style.top = targetY + 'px';
                popup.innerHTML = target.href;

                return;
            }

            target.id = Math.ceil(Math.random() * 100000);
            targets[target.id] = target.href;

            target.addEventListener('mouseover', function() {

                targets[target.id] = targets[target.id] + 1;
                console.log(target.id, targets[target.id]);
            });
        });

        // Link can be from different elements such as Buttons and Divs.
        // Don't need to hover.
        // Rules for websites to run extension on.
        // Can emails embed javascript?
        // Can elements with custom listeners be detected?
        // let links = {};
        // let interval = 500;
        // let max = 60000;
        // let elapsed = 0;
        // const intervalId = setInterval(() => {
        //     if (elapsed >= max) {
        //         links.values().forEach(console.log);
        //         clearInterval(intervalId);
        //     }
        //     elapsed += interval;
        //     body.querySelectorAll('a[href]').forEach(link => {
        //         if (link.id && links[link.id]) {
        //             return;
        //         }
        //         let id = Math.ceil(Math.random() * 100000);
        //         link.id = id;
        //         links[id] = link;
        //     });
        //     console.log(links);
        // }, interval);
    }
});

