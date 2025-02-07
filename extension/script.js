window.addEventListener('load', async () => {
    if (document.readyState == 'complete') {
        let targets = {};
        let body = document.getElementById(':1');
        body.addEventListener('mouseover', (event) => {
            const target = event.target;
            if (!(target instanceof HTMLAnchorElement) || !target.hasAttribute('href')) {
                return;
            } else if (targets.hasOwnProperty(target?.id)) {
                return;
            }

            target.id = Math.ceil(Math.random() * 100000);
            targets[target.id] = 0;

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

