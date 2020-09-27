//动态绑定点击事件
var bindClick = (dom, fn) => {
    dom.addEventListener('click', debounce(fn), true);
}


// 防抖处理
function debounce(fn) {
    let timer = null;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => fn.call(this, arguments), 500);
    }
}

// 按钮绑定点击事件
bindClick(w_New, createDom);



function createDom() {
    let times = new Date().getTime();
    let w_box_id = 'w_dom-' + times;
    let w_boxEchart_id = 'w_boxEchart-' + times;
    let w_boxRight_id = 'w_boxRight-' + times;
    let w_boxBottom_id = 'w_boxBottom-' + times;
    let w_boxRightBottom_id = 'w_boxRightBottom-' + times;


    let html = $(`<div id="${w_box_id}" class="w_box">
<div class="w_boxMain">
    <div class="w_boxMess">
        <p>信息展示</p>
        <div id="${w_boxEchart_id}" class="w_boxEchart"></div>
    </div>
    <div id="${w_boxRight_id}" class="w_boxRight"></div>
    <div id="${w_boxBottom_id}" class="w_boxBottom"></div>
    <div id="${w_boxRightBottom_id}" class="w_boxRightBottom"></div>
</div>
</div>`)

    $('#w_Main').append(html);



    control('bottom', document.getElementById(w_boxBottom_id), document.getElementById('w_Main'));
    control('right', document.getElementById(w_boxRight_id), document.getElementById('w_Main'));
    control('right_bottom', document.getElementById(w_boxRightBottom_id), document.getElementById('w_Main'));
    control('move', document.getElementById(w_box_id), document.getElementById('w_Main'));
}

// 存储相应id的拖拉拽事件
var dom_obj = {};


// 拖拽控制绑定

/**
 * @param  type  绑定类型 分为右，下，右下 
 * @param  dom   绑定的元素
 * @param  parentDom  父元素
 */
function control(type, dom, parentDom) {

    let id;
    dom.onmousedown = (ev) => {
        var _event = ev || event;
        id = dom.id;
        if (!dom_obj[id]) {
            dom_obj[id] = {};
        }
        // 添加高亮
        dom.classList.add("w_boxLight");
        dom.style.position = 'absolute';

        // 鼠标距离上顶部的距离
        dom_obj[id].mouseTop = _event.clientY;
        // 元素距离上顶部的距离
        dom_obj[id].offsetTop = dom.offsetTop;
        dom_obj[id].relativeTop = _event.clientY - dom.offsetTop;
        // 鼠标距离左边距离
        dom_obj[id].mouseLeft = _event.clientX;
        // 元素距离左边距离
        dom_obj[id].offsetLeft = dom.offsetLeft;
        dom_obj[id].relativeLeft = _event.clientX - dom.offsetLeft;
        // 阻止捕获和冒泡事件
        _event.stopPropagation();

        if (dom.setCapture) { //兼容ie
            dom.onmousemove = fn_move;
            dom.onmouseup = fn_up;
            dom.setCapture();
        } else {
            document.addEventListener('mousemove', fn_move, true);
            document.addEventListener('mouseup', fn_up, true);
        }
    }

    // 鼠标移动事件
    var fn_move = (ev) => {
        let _event = ev || event;

        let idArr = id.split('-');
        // 最外层盒子
        let mainDiv = document.getElementById(`w_dom-${idArr[1]}`);
        // 右下角最小的div
        let divHeight = document.getElementById(`w_boxRightBottom-${idArr[1]}`).offsetHeight;
        let divWidth = document.getElementById(`w_boxRightBottom-${idArr[1]}`).offsetWidth;
        // 绑定事件下边缘  || 右下边缘
        if (type === 'bottom' || type === 'right_bottom') {
            let _height = _event.clientY - dom_obj[id].relativeTop + divHeight;
            if (_height < divHeight) {
                _height = divHeight;
            } else if (_height > parentDom.clientHeight - mainDiv.offsetTop) {
                _height = parentDom.clientHeight - mainDiv.offsetTop - 5;
            }
            mainDiv.style.height = `${_height}px`;
        }

        // 绑定事件下边缘  || 右下边缘
        if (type === 'right' || type === 'right_bottom') {
            let _width = _event.clientX - dom_obj[id].relativeLeft + divWidth;
            if (_width < divWidth) {
                _width = divWidth;
            } else if (_width > parentDom.clientWidth - mainDiv.offsetLeft) {
                _width = parentDom.clientWidth - mainDiv.offsetLeft - 5;
            }
            mainDiv.style.width = `${_width}px`;
        }

        // 绑定事件移动
        if (type === 'move') {
            let _left = _event.clientX - dom_obj[id].relativeLeft;
            let _top = _event.clientY - dom_obj[id].relativeTop;
            if (_left < 0) {
                _left = 0;
            } else if (_left > parentDom.clientWidth - mainDiv.offsetWidth) {
                _left = parentDom.clientWidth - mainDiv.offsetWidth;
            }
            if (_top < 0) {
                _top = 0;
            } else if (_top > parentDom.clientHeight - mainDiv.offsetHeight) {
                _top = parentDom.clientHeight - mainDiv.offsetHeight;
            }
            mainDiv.style.left = `${_left}px`;
            mainDiv.style.top = `${_top}px`;
        }
    }

    // 鼠标抬起，解除绑定
    var fn_up = (ev) => {
        // 移除高亮
        dom.classList.remove("w_boxLight");
        dom.style.position = 'relative';


        if (dom.releaseCapture) {
            dom.mousemove = null;
            dom.mouseup = null;
            dom.releaseCapture();
        } else {
            document.removeEventListener('mousemove', fn_move, true);
            document.removeEventListener('mouseup', fn_up, true);
        }
    }
}