let popup;
let tracer;

function showTracer(left, top, width, height) {
    tracer.style.display = 'block';
    tracer.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
    tracer.style.position = 'absolute';
    tracer.style.left = left + 'px';
    tracer.style.top = top + 'px';
    tracer.style.width = width + 'px';
    tracer.style.height = height + 'px';
}

function showPopup(left, top, width, height, html) {
    popup.style.display = 'block';
    popup.style.position = 'absolute';
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.width = width + 'px';
    popup.style.height = height + 'px';
    popup.innerHTML = html;
}

window.addEventListener('load', async () => {
    popup = document.createElement('div');
    popup.id = 'p1';
    popup.style.display = 'none';
    tracer = document.createElement('div');
    tracer.style.display = 'none';
    tracer.id = 'tracer';

    if (document.readyState == 'complete') {
        let targets = {};
        let body = document.getElementById(':1');
        
        body.appendChild(popup);
        body.appendChild(tracer);
        body.addEventListener('mouseover', (event) => {
            let target = event.target;

            if (target.id == popup.id || target.id == tracer.id) {
                return;
            }
            // covers e.g. <a><img></a>
            if (target.parentElement instanceof HTMLAnchorElement) {
                target = target.parentElement;
            }

            if (!(target instanceof HTMLAnchorElement) || !target.hasAttribute('href')) {
                popup.style.display = 'none';
                tracer.style.display = 'none';
                return;
            }  else if (target.id && targets.hasOwnProperty(target.id)) {
                return;
            }

            target.id = Math.ceil(Math.random() * 100000);
            targets[target.id] = target.href;

            target.addEventListener('mouseenter', (event) => {
                const rect = event.target.getBoundingClientRect();
                const left = rect.left + window.scrollX;
                const top = rect.top + window.scrollY;
                const width = event.target.offsetWidth;
                const height = event.target.offsetHeight;

                showTracer(left, top, width, height);
                showPopup(left, top, width, height, targets[event.target.id]);
            });
        });

        // Link can be from different elements such as Buttons and Divs.
        // Don't need to hover.
        // Rules for websites to run extension on.
        // Can emails embed javascript?
        // Can elements with custom listeners be detected?
    }
});

