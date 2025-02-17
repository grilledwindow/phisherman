let popup;
let tracer;

window.addEventListener('load', async () => {
    popup = createHiddenDiv('popup');
    tracer = createHiddenDiv('tracer');

    // poll for body because it takes time to load
    let body;
    const poll = setInterval(() => {
        body = document.querySelector('div.a3s.aiL');
        if (body !== null) {
            console.log(body);
            clearInterval(poll);
            main(body);
        }
    }, 500);
});

function main(body) {
    // const iframe = body.querySelector('iframe');
    // while (iframe) {
    //     body = iframe.contentDocument || iframe.contentWindow.document;
    //     iframe = body.querySelector('iframe');
    //     if (iframe === null) {
    //         break;
    //     } else {
    //         iframe = iframe.contentDocument || iframe.contentWindow.document;
    //     }
    //     console.log(body);
    // }
    let html = document.querySelector('html');
    html.appendChild(popup);
    html.appendChild(tracer);

    let targets = {};
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

            fetch(`http://localhost:5000/check_url?url=${event.target.href}`)
                .then(res => res.json())
                .then(data => {
                    console.log('spoof:', data.spoof);
                    console.log('typosquat:', data.typosquat);
                });
        });
        // Link can be from different elements such as Buttons and Divs.
        // Don't need to hover.
        // Rules for websites to run extension on.
        // Can emails embed javascript?
        // Can elements with custom listeners be detected?
    });
}

function createHiddenDiv(id) {
    let div = document.createElement('div');
    div.id = id;
    div.style.display = 'none';
    return div;
}

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

