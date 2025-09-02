function gs_addLeadingZero(s){return s<10?`0${s}`:s}function gs_updateCountdown(s){let n=new Date(s.getAttribute("data-end")),t=new Date,e=n-t;if(e<=0){let d=s.getAttribute("data-time-up-text")||"Time's up!";s.textContent=d;return}s.innerHTML=`
    <span class="gs_days gs_countdown_item">${gs_addLeadingZero(Math.floor(e/864e5))}</span>
    <span class="gs_date_divider">:</span>
    <span class="gs_hours gs_countdown_item">${gs_addLeadingZero(Math.floor(e%864e5/36e5))}</span>
    <span class="gs_date_divider">:</span>
    <span class="gs_minutes gs_countdown_item">${gs_addLeadingZero(Math.floor(e%36e5/6e4))}</span>
    <span class="gs_date_divider">:</span>
    <span class="gs_seconds gs_countdown_item">${gs_addLeadingZero(Math.floor(e%6e4/1e3))}</span>
  `}const gs_countdownElements=document.querySelectorAll(".gs_countdown");function gs_updateAllCountdowns(){gs_countdownElements.forEach(gs_updateCountdown)}gs_updateAllCountdowns(),setInterval(gs_updateAllCountdowns,1e3);