// 日历插件

// 声明构造函数
/**
 * 
 * @param {String} date 可选参数，日期字符串，格式为xxxx/xx/xx，默认为当前系统日期;
 * @param {Boolean} enFlag 可选参数，是否开启英文模式，默认为false；
 * @param {String} rootElement 可选参数，根元素的选择器，决定生成的日历最终渲染到那个页面元素中，默认为body；
 */
function Calendar(date, enFlag, rootElement) {
  this.date = new Date();

  if (date) {
    this.date =
      (date.match(/^\d{4}\/[0-1][0-9]\/[0-3][0-9]$/)
        ? new Date(date)
        : false) || this.date;
  }

  //   年月日
  this.Y = this.date.getFullYear();
  this.M = this.date.getMonth() + 1;
  this.D = this.date.getDate(); // 一个月中的第几天
  this.d = new Date(this.Y + "/" + this.M + "/" + 01).getDay(); // 本月第一天是星期几

  // 每月天数
  this.february = this.Y % 4 === 0 || this.Y % 400 === 0 ? 29 : 28;
  this.monthDays = [31, this.february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  this.rootElement = rootElement || "body"; // 新生成的元素插入哪个元素中，默认插入body
  // 中英文表头
  this.sheetHeader_zh = ["日", "一", "二", "三", "四", "五", "六"];
  this.sheetHeader_en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  //   开启中英文格式的标志
  this.enFlag = enFlag || false; // 是否开启英文表头，默认不开启
  this.sheetHeader = this.enFlag ? this.sheetHeader_en : this.sheetHeader_zh;

  //   需要动态设置日期的标签 ;初始化为空，在init完成后动态获取
  this.tdEle = {}; // 日历中所有td标签
  this.showDateEle = {}; // 显示当前年份月份的标签
  this.msgBoxEle = {}; // 弹出框元素
  this.msgBoxContentEle = {}; // 弹出框中的内容元素
  this.calendar = {}; // 整个日历元素

  // 控制显示还是隐藏的标志
  this.showFlag = true; // 初始化为显示

  //   初始化对象
  this.init();
}

/**
 * 初始化函数
 */
Calendar.prototype.init = function() {
  // 创建日历结构
  this.setElements();

  //   动态获取要设置内容的标签
  this.calendar = document.querySelector(".calendar-container");
  this.tdEle = document.querySelectorAll(".calendar-table td");
  this.showDateEle = document.querySelector(".calendar-date-show");
  this.msgBoxEle = document.querySelector("#msg_box");
  this.msgBoxContentEle = document.querySelector("#msg_box #msg_contente");

  //   设置日历内容
  this.setContent();

  //   为按钮注册事件
  this.setBtnEvent();

  // 为每个日期表格注册点击事件
  this.setShowSelectedEvent();
};

/**
 * 自动生成日历结构
 */
Calendar.prototype.setElements = function() {
  let calendarHtmlStr = "";

  calendarHtmlStr +=
    '  <div class="calendar-container">' +
    '  <div class="calendar-header-toolbar clearfix">' +
    '    <div class="calendar-left">' +
    '      <button id="calendar-subtract-y" class="calendar-button-primary">' +
    "        Y-" +
    "      </button>" +
    '      <button id="calendar-subtract-m" class="calendar-button-primary">' +
    "        M-" +
    "      </button>" +
    "    </div>" +
    '    <div class="calendar-right">' +
    '      <button id="calendar-add-m" class="calendar-button-primary">' +
    "        M+" +
    "      </button>" +
    '      <button id="calendar-add-y" class="calendar-button-primary">' +
    "        Y+" +
    "      </button>" +
    "    </div>" +
    '    <div class="calendar-center">' +
    `      <h2 class="calendar-date-show">${this.Y}年${this.M}月</h2>` +
    "    </div>" +
    "  </div>" +
    '  <table class="calendar-table">' +
    "    <thead>" +
    "      <tr>";

  for (let i = 0; i < this.sheetHeader.length; i++) {
    calendarHtmlStr += `<th>${this.sheetHeader[i]}</th>`;
  }

  calendarHtmlStr += "      </tr>" + "    </thead>" + "    <tbody>";

  for (let i = 0; i < 5; i++) {
    calendarHtmlStr += "      <tr>";

    for (let j = 0; j < 7; j++) {
      calendarHtmlStr += "        <td></td>";
    }

    calendarHtmlStr += "      </tr>";
  }

  calendarHtmlStr += "    </tbody>" + "  </table>" + "</div>";

  // 插入弹出框
  calendarHtmlStr +=
    '<div class="msg-box" id="msg_box">' +
    '<p id="msg_title">当前日期</p>' +
    '<p id="msg_contente"></p>' +
    '<button id="msg_btn">确定</button>' +
    "</div>";

  document.querySelector(this.rootElement).innerHTML =
    document.querySelector(this.rootElement).innerHTML + calendarHtmlStr;
};

/**
 * 设置日历主体内容
 */
Calendar.prototype.setContent = function() {
  let activeFlag = false,
    currentMonthDays =
      this.M === 2 ? this.february : this.monthDays[this.M - 1];
  // 设置显示区的年份和月份
  this.showDateEle.innerHTML = this.Y + "年" + this.M + "月";

  for (let i = 0; i < this.tdEle.length; i++) {
    if (i >= this.d && i < this.d + currentMonthDays) {
      // 判断是否是用户输入的日期,以便设置高亮
      activeFlag =
        this.Y === this.date.getFullYear() &&
        this.M === this.date.getMonth() + 1 &&
        i + 1 === this.d + this.date.getDate();
      //   设置内容
      this.tdEle[i].innerHTML = i - this.d + 1;
      this.tdEle[i].setAttribute("class", activeFlag ? "active" : "");
      continue;
    }
    this.tdEle[i].innerHTML = "";
    this.tdEle[i].setAttribute("class", "");
  }
};

/**
 * 设置按钮事件
 */
Calendar.prototype.setBtnEvent = function() {
  let btnContainer = document.querySelector(".calendar-header-toolbar"),
    that = this;

  btnContainer.addEventListener("click", function(e) {
    let ele = e.target;
    switch (ele.id) {
      case "calendar-add-y":
        that.Y++;
        that.february = that.Y % 4 === 0 || that.Y % 400 === 0 ? 29 : 28;
        that.d = new Date(that.Y + "/" + that.M + "/" + 01).getDay();
        that.setContent();
        break;
      case "calendar-add-m":
        that.M++;
        if (that.M > 12) {
          that.M = 1;
          that.Y++;
        }
        that.d = new Date(that.Y + "/" + that.M + "/" + 01).getDay();
        that.february = that.Y % 4 === 0 || that.Y % 400 === 0 ? 29 : 28;
        that.setContent();
        break;
      case "calendar-subtract-y":
        that.Y--;
        that.february = that.Y % 4 === 0 || that.Y % 400 === 0 ? 29 : 28;
        that.d = new Date(that.Y + "/" + that.M + "/" + 01).getDay();
        that.setContent();
        break;
      case "calendar-subtract-m":
        that.M--;
        if (that.M < 1) {
          that.M = 12;
          that.Y--;
        }
        that.d = new Date(that.Y + "/" + that.M + "/" + 01).getDay();
        that.february = that.Y % 4 === 0 || that.Y % 400 === 0 ? 29 : 28;
        that.setContent();
        break;
    }
  });
};

/**
 * 用弹窗显示用户选中日期
 */
Calendar.prototype.setShowSelectedEvent = function() {
  let that = this;
  // 为表格中的每个td元素注册点击事件
  document
    .querySelector("table.calendar-table")
    .addEventListener("click", function(e) {
      if (e.target.nodeName === "TD" && e.target.innerText != "") {
        that.msgBoxEle.style.display = "block";
        that.msgBoxContentEle.innerText =
          that.Y + "年" + that.M + "月" + e.target.innerText + "日";
      }
    });

  // 为确定按钮注册点击事件
  this.msgBoxEle.children[2].addEventListener("click", function(e) {
    that.msgBoxEle.style.display = "none";
  });
};

/**
 * 切换日历组件显示还是隐藏
 */
Calendar.prototype.toggle = function() {
  // 切换标志
  if (this.showFlag) {
    this.calendar.style.display = "none";
  } else {
    this.calendar.style.display = "block";
  }
  this.showFlag = !this.showFlag;
};

/**
 * 用来更新日期的方法
 */
Calendar.prototype.setDate = function(date) {
  this.date = new Date();

  if (date) {
    this.date =
      (date.match(/^\d{4}\/[0-1][0-9]\/[0-3][0-9]$/)
        ? new Date(date)
        : false) || this.date;
  }

  //   年月日
  this.Y = this.date.getFullYear();
  this.M = this.date.getMonth() + 1;
  this.D = this.date.getDate(); // 一个月中的第几天
  this.d = new Date(this.Y + "/" + this.M + "/" + 01).getDay(); // 本月第一天是星期几

  this.setContent()
};
