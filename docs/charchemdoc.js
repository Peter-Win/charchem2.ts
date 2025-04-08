/**
 * @param {string} tag 
 * @param {HTMLElement | null} owner 
 * @param {*} options 
 * @returns {HTMLElement}
 */
function createElem(tag, owner, options) {
    options = options || {};
    var elem = document.createElement(tag);
    if (owner) owner.appendChild(elem);
    if (options.cls) elem.classList.add(options.cls);
    if (options.style) Object.assign(elem.style, options.style);
    if (options.html) elem.innerHTML = options.html; 
    if (options.text) elem.innerText = options.text;
    return elem;
}

/**
 * @param {string} search 
 * @returns {Record<string,string>}
 */
function parseSearch(search) {
    if (search[0] !== "?") return {}
    var res = {}, i, pairs = search.slice(1).split("&");
    for (i=0; i<pairs.length; i++) {
        var eq = pairs[i].split("=");
        if (eq.length === 2) {
            res[eq[0]] = decodeURIComponent(eq[1]);
        }
    }
    return res;
}

function parseHref(href) {
    var k = href.indexOf("?");
    var rel = k<0 ? href : href.slice(k);
    var a = rel.split("#");
    return {params: parseSearch(a[0]), hash: a[1]}
}

window.addEventListener("load", function(){
    ChemSys.addDict({
        ru: {
            Reagent: "Реагент",
            Node: "Узел",
        }
    });
    initLangHandlers();
    var params = parseSearch(location.search);
    showPage(params.p || "home", location.hash.slice(1));
});

window.addEventListener("popstate", function(e) {
    var state = e.state;
    if (typeof state === "object") {
        showPage(state.pageId, state.hash);
    }
});

function setInternalRefHandlers(page) {
    var i, allRefs = page.querySelectorAll("a[href^='?']");
    for (i=0; i<allRefs.length; i++) onRef(allRefs[i]);
    function onRef(ref) {
        ref.addEventListener("click", function(e) {
            e.preventDefault();
            var href = e.currentTarget.href;
            var res = parseHref(href);
            var pageId = res.params.p;
            console.log("Internal link", pageId);
            window.history.pushState({
                pageId: pageId,
                hash: res.hash,
            }, null, href);
            showPage(pageId, res.hash);
        })
    }    
}

var readyPages = {}

var specialPageInit = {
    templates() {
        initTemplates();
    },
    figures() {
        initSpiroCalc();
    },
}
var specialPageActive = {
    dict() {
        var old = curPage.querySelector(".active-therm");
        if (old) old.classList.remove("active-therm");
        console.log("old", old, "curPageHash", curPageHash)
        if (curPageHash) {
            var cur = curPage.querySelector("#"+curPageHash);
            if (cur) cur.classList.add("active-therm");
        }
    },
}

/**
 * {HTMLDivElement | null}
 */
var curPage = null;
var curPageId = "";
var curPageHash = undefined;

function showPage(pageId, hash) {
    console.log("showPage",pageId, hash);
    var page = document.getElementById(pageId);
    if (!page) {
        console.error("Invalid pageId", pageId);
        return;
    }
    if (curPage) {
        curPage.style.display="none";
    }
    curPage = page;
    curPageId = pageId;
    curPageHash = hash;
    page.style.display="block";
    if (!readyPages[pageId]) {
        readyPages[pageId] = 1;
        drawFormulas(page);
        drawBreadcrumbs(page);
        buildTherms(page);
        buildPageContents(page);
        setInternalRefHandlers(page);
        var specInit = specialPageInit[pageId];
        if (specInit) specInit();
    }
    if (hash) {
        var el = page.querySelector("#"+hash);
        if (el && el.scrollIntoView) el.scrollIntoView();
    } else {
        window.scrollTo({top:0})
    }
    var specAct = specialPageActive[pageId];
    if (specAct) specAct();
}

function buildOwners(list, page, maxLevel) {
    const ownerId = page.getAttribute("data-owner");
    if (ownerId) {
        var owner = document.getElementById(ownerId);
        if (owner) {
            var a = makePageRef(owner);
            if (a) {
                list.unshift(a);
                if (maxLevel>0) buildOwners(list, owner, maxLevel-1);
            }
        }
    }
    return list;
}

function makePageRef(page) {
    if (!page) return null;
    var h1 = page.querySelector("h1");
    var pageId = page.id;
    if (!h1 || !pageId) return null;
    const a = createElem("a", null, {html: h1.innerHTML});
    a.href = "?p="+pageId;
    return a;
}

/**
 * @param {HTMLDivElement} page 
 */
function drawBreadcrumbs(page) {
    var bread = page.querySelector(".bread-crumbs");
    if (!bread) {
        var items = buildOwners([], page, 5);
        if (items.length > 0) {
            bread = createElem("nav", null, {cls: "bread-crumbs"});
            for (var i=0; i<items.length; i++) {
                if (i>0) createElem("span", bread, {html: "&raquo;"});
                bread.appendChild(items[i]);
            }
            page.insertAdjacentElement("afterbegin", bread);
        }
    }
    var bottom = page.querySelector(".bottom-nav");
    if (!bottom) {
        bottom = createElem("nav", page, {cls: "bottom-nav"});
        var prevA = makePageRef(page.previousElementSibling);
        var nextA = makePageRef(page.nextElementSibling);
        var prev = createElem("div", bottom);
        if (prevA) {
            prev.append("←")
            prev.appendChild(prevA);
        }
        var next = createElem("div", bottom);
        if (nextA) {
            next.appendChild(nextA);
            next.append("→")
        }
    }
}

function buildTherms(page) {
    // Все термины со ссылкой на словарь.
    var allTherms = page.querySelectorAll("a[data-ref]");
    for (i=0; i<allTherms.length; i++) {
        var a = allTherms[i];
        a.href = "?p=dict#d-" + a.getAttribute("data-ref");
    }
}

function buildPageContents(page) {
    var i, pagesList = document.getElementsByTagName("page");
    var ctxList = page.getElementsByClassName("contents");
    for (i=0; i<ctxList.length; i++) {
        buildContents(ctxList[i], pagesList);
    }
}

function buildContents(contentElem, pagesList) {
    var ownerId = contentElem.getAttribute("data-owner");
    if (!ownerId) return;
    var i, links = [];
    for (i=0; i<pagesList.length; i++) {
        var p = pagesList[i];
        var pageOwnerId = p.getAttribute("data-owner");
        if (pageOwnerId === ownerId) {
            var a = makePageRef(p);
            if (a) links.push(a);
        }
    }
    for (i=0; i<links.length; i++) {
        var li = createElem("li", contentElem);
        li.appendChild(links[i]);
    }
}


/**
 * @param {HTMLDivElement} page 
 */
function drawFormulas(page) {
    var i=0, formulas = page.querySelectorAll(".echem-formula");
    var intervalId = setInterval(function() {
        var f = formulas[i++];
        if (!f) {
            clearInterval(intervalId)
        } else if (!f.getAttribute("data-src")) {
            ChemSys.draw(f, f.innerText, {});
        }
    }, 1);
}

// ----- templates

var tmReady = false;
function initTemplates() {
  if (tmReady) return;  
  tmReady = true;
  try {  
    var activeLeft = null;
    var activeRight = null;
    var leftListElem = document.getElementById("tmList");
    var leftList = leftListElem.childNodes;
    for (var i=0; i<leftList.length; i++) onLeft(leftList[i]);
    function onLeft(leftElem) {
        var leftId = leftElem.id;
        if (leftId) {
            var rightId = "def-" + leftId;
            console.log("rightId", rightId);
            var rightElem = document.getElementById(rightId);
            var titleElem = rightElem.querySelector("h2");
            if (titleElem) {
                var titleElemL = titleElem.querySelector("[lang="+curLang+"]");
                leftElem.title = (titleElemL || titleElem).innerText;
                leftElem.addEventListener("click", function() {
                    if (activeLeft) activeLeft.classList.remove("active");
                    if (activeRight) activeRight.classList.remove("active");
                    activeLeft = leftElem;
                    leftElem.classList.add("active");
                    activeRight = rightElem;
                    rightElem.classList.add("active");
                    drawTmCode(leftElem, rightElem);
                })
            }
        }
    }
  } catch (e) {
    console.error(e);
  }  
}
function drawTmCode(leftElem, rightElem) {
    var codeBox = rightElem.querySelector(".tm-code-box");
    if (codeBox) return;
    var eformula = leftElem.querySelector(".echem-formula[data-src]")
    if (eformula) {
        var src = eformula.getAttribute("data-src");
        var dst = rightElem.querySelector("p");
        if (src && dst) {
            codeBox = createElem("div", rightElem, {cls: "tm-code-box"});
            createElem("code", codeBox, {cls: "chem-code", text: src});
            rightElem.insertBefore(codeBox, dst);
        }
    }
}

/**
 * @param {Element} elem 
 * @param {string} cls 
 * @param {boolean} visible 
 */
function toggleClass(elem, cls, visible) {
    if (visible) {
        elem.classList.add(cls);
    } else {
        elem.classList.remove(cls);
    }
}

var curLang = "en";
function setLang(locale) {
    toggleClass(document.body, "hide-ru", locale !== "ru");
    toggleClass(document.body, "hide-en", locale !== "en");
    toggleClass(document.getElementById("setRu"), "active", locale === "ru");
    toggleClass(document.getElementById("setEn"), "active", locale === "en");
    curLang = locale;
    try {
        localStorage.setItem("language", locale);
    } catch(e) {}
}
function initLangHandlers() {
    try {
        var lang = localStorage.getItem("language");
        if (!lang && /^ru/i.test(navigator.language)) {
            lang="ru";
        }
        setLang(lang === "ru" ? lang : "en");
        ChemSys.curLang = lang;
    } catch (e) {}
    document.getElementById("setRu").addEventListener("click", function() {
        setLang("ru");
    })
    document.getElementById("setEn").addEventListener("click", function() {
        setLang("en");
    })
}

function initSpiroCalc() {
    var elN = document.getElementById("spiro-n");
    var elM = document.getElementById("spiro-m");
    var elA1 = document.getElementById("spiro-a1");
    var elA2 = document.getElementById("spiro-a2");
    var elCode = document.getElementById("spiro-code");
    var elF = document.getElementById("spiro-formula");
    function recalc() {
        var ok = true;
        function check(elem) {
            var res = 1;
            var err = false;
            var txt = elem.value.trim();
            if (/^\d+$/.test(txt)) {
                var num = +txt;
                if (num >= 3) res = num;
                else err = true;
            } else err = true;
            if (err) {
                elem.classList.add("invalid");
                ok = false;
            } else {
                elem.classList.remove("invalid");
            }
            return res;
        }
        function txtAngle(value) {
            return "" + Math.round(value*100)/100;
        }
        var n = check(elN);
        var m = check(elM);
        var code = "";
        if (ok) {
            var a1 = 180 * (1 - (n + m) / (n * m));
            var a2 = 180 * (n - m) / (n * m);
            elA1.value = txtAngle(a1);
            elA2.value = txtAngle(a2);
            code = (n & 1) ? "|" : "_(A"+(90-180/n)+")";
            var i = 1;
            var qN = n === 5 ? "" : n;
            for (; i<n/2; i++) {
                code += "_q" + qN;
            }
            var relAngle = "_(a"+txtAngle(a1)+")";
            code += relAngle;
            var qM = m === 5 ? "" : m;
            for (var j=1; j<m; j++) code += "_q" + qM;
            code += relAngle;
            i++;
            for (; i<n; i++) code += "_q" + qN;
            ChemSys.draw(elF, code);
        } else {
            elA1.value = "";
            elA2.value = "";
            elF.innerHTML = "";
        }
        elCode.innerText = code;
    }
    elN.value = "3";
    elM.value = "4";
    elN.addEventListener("input", recalc);
    elM.addEventListener("input", recalc);
    recalc();
}