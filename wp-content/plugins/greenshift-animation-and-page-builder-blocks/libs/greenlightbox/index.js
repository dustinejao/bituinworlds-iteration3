class GSLightbox{constructor(e={}){this.options={linkAttribute:"href",iframeWidth:"16",iframeHeight:"9",...e},this.injectStyles(),this.createLightboxElement(),this.lightbox=document.getElementById("gs-lightbox"),this.content=this.lightbox.querySelector(".gs-lightbox-content"),this.closeBtn=this.lightbox.querySelector(".gs-lightbox-close"),this.closeBtn.addEventListener("click",()=>this.close()),this.lightbox.addEventListener("click",e=>{e.target===this.lightbox&&this.close()}),document.addEventListener("keydown",e=>{"Escape"===e.key&&this.close()}),this.initLinks()}injectStyles(){let e=document.createElement("style");e.textContent=`
    .gs-lightbox {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        z-index: 999999;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--wp--custom--lightbox--background-color, rgba(0, 0, 0, 0.8));
        opacity: 0;
        visibility: hidden;
        transition: var(--gs-root-transition, all .3s ease-in-out);
        pointer-events: none;
    }
    .gs-lightbox.active {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
    }
    .gs-lightbox-content {
        max-width: 90%;
        max-height: 90%;
        overflow: auto;
        transform: scale(0.8);
        transition: var(--gs-root-transition, all .3s ease-in-out);
    }
    .gs-lightbox.active .gs-lightbox-content {
        transform: scale(1);
    }
    .gs-lightbox-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--wp--custom--lightbox--close-button--background-color, rgba(0, 0, 0, 0.5));
        border: none;
        cursor: pointer;
        display: flex;
        color: var(--wp--custom--close-button--color, #ffffff);
        justify-content: center;
        align-items: center;
        transition: background-color 0.3s ease;
    }
    .gs-lightbox-close:hover {
        background-color: rgba(0, 0, 0, 0.8);
    }
    .gs-lightbox-content img {
        max-width: 100%;
        max-height: 80vh;
        display: block;
    }
    .gs-lightbox-video-wrapper {
        position: relative;
        max-width: 90%;
        width: 142.3vh;
        margin: 0 auto;
        overflow: hidden;
        max-height: 80vh;
    }
    .gs-lightbox-video-wrapper::before {
        content: "";
        display: block;
        padding-top: 56.25%; /* 16:9 aspect ratio */
    }
    .gs-lightbox-video-wrapper iframe,
    .gs-lightbox-video-wrapper video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
`,document.head.appendChild(e)}createLightboxElement(){let e=`
    <div id="gs-lightbox" class="gs-lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Lightbox">
        <div class="gs-lightbox-content" tabindex="-1"></div>
        <button class="gs-lightbox-close" aria-label="Close lightbox">
            <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/></svg>
        </button>
    </div>
`;document.body.insertAdjacentHTML("beforeend",e)}initLinks(){document.querySelectorAll("[data-gs-lightbox]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault();let i=e.getAttribute(this.options.linkAttribute)||e.getAttribute("data-lightbox-src");i&&this.open(i,e)})})}open(e,t){if(this.content.innerHTML="",this.triggerElement=t,"string"==typeof e){if(e.includes("youtube.com")||e.includes("youtu.be")){let i=this.getYouTubeId(e);this.createResponsiveVideo(`https://www.youtube.com/embed/${i}`)}else if(e.includes("vimeo.com")){let o=this.getVimeoId(e);this.createResponsiveVideo(`https://player.vimeo.com/video/${o}`)}else if(null!==e.match(/\.(mp4)$/))this.createResponsiveVideo(e,!0);else{let l=document.createElement("img");l.src=e,l.alt="Lightbox Image",this.content.appendChild(l)}}else if(e instanceof HTMLElement){let s=e;if(s&&"function"==typeof s.cloneNode)try{let n=s.cloneNode(!0);n.classList.add("gs-lightbox-initial"),this.content.appendChild(n),setTimeout(()=>{n.classList.add("active"),n.classList.remove("gs-lightbox-initial")},10)}catch(r){console.error("Failed to clone element:",r)}else s&&(this.content.innerHTML=s.outerHTML||s.textContent)}setTimeout(()=>{this.lightbox.classList.add("active")},10),this.triggerElement&&this.triggerElement.classList.add("triggeractive"),this.lightbox.setAttribute("aria-hidden","false"),this.content.focus()}createResponsiveVideo(e,t=!1){let i=document.createElement("div");if(i.className="gs-lightbox-video-wrapper",t){let o=document.createElement("video");o.src=e,o.controls=!0,o.autoplay=!0,i.appendChild(o)}else if(e.includes("youtube.com")||e.includes("youtu.be")){let l=this.getYouTubeId(e),s=document.createElement("div");s.id="gs-youtube-player",i.appendChild(s),this.loadYouTubeAPIAndCreatePlayer(l,s)}else{let n=document.createElement("iframe");(e.includes("youtube.com")||e.includes("youtu.be"))&&(e+=(e.includes("?")?"&":"?")+"autoplay=1"),n.src=e,n.frameBorder="0",n.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,i.appendChild(n)}this.content.appendChild(i)}loadYouTubeAPIAndCreatePlayer(e,t){if(window.YT&&window.YT.Player)this.createYouTubePlayer(e,t);else{let i=document.createElement("script");i.src="https://www.youtube.com/iframe_api";let o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(i,o),window.onYouTubeIframeAPIReady=()=>{this.createYouTubePlayer(e,t)}}}createYouTubePlayer(e,t){new window.YT.Player(t,{height:"100%",width:"100%",videoId:e,playerVars:{autoplay:1},events:{onReady(e){e.target.getIframe().focus()}}})}close(){this.lightbox.classList.remove("active"),this.lightbox.setAttribute("aria-hidden","true"),this.triggerElement&&(this.triggerElement.classList.remove("triggeractive"),this.triggerElement.focus()),setTimeout(()=>{this.content.innerHTML=""},300)}getYouTubeId(e){let t=e.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);return t&&11===t[2].length?t[2]:null}getVimeoId(e){let t=e.match(/vimeo.*\/(\d+)/i);return t?t[1]:null}}let greenLightbox;function openGreenlightbox(e,t){greenLightbox&&greenLightbox.open(e,t)}document.addEventListener("DOMContentLoaded",()=>{greenLightbox=new GSLightbox});