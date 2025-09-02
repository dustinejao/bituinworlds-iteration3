"use strict";

document.addEventListener("click", (e) => {
    let shareLink = (e.target.hasAttribute('data-social-service')) ? e.target : e.target.closest('[data-social-service]');
    if (shareLink) {
        e.preventDefault();
        let href = shareLink.getAttribute("data-href");
        let service = shareLink.getAttribute("data-social-service");
        let width = service === "pinterest" ? 750 : 650,
        height = service === "twitter" || service === "linkedin" ? 500 : service === "pinterest" ? 320 : 300,
        top = (screen.height / 2) - height / 2,
        left = (screen.width / 2) - width / 2;
        let options = `top=${top},left=${left},width=${width},height=${height}`;
        window.open(href, service, options);
    }
}, false);
