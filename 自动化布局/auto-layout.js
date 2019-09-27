/**
 *
 * @param {String} layoutStr 必须的参数，通过此确认用户要设置的页面结构及元素数量
 * @param {Object} optJsonData 可选参数，如果如果用户传入了内容则按照用户传入的内容向页面结构中填充数据，必须是json格式，值可以是模板字符串或者纯文本
 * @param {Boolean} optPrintKeyFlag 可选参数，是否输出键，默认支持true
 * @param {String} optRootElement 可选参数，元素选择器，生成的页面结构将输出到该元素中，默认值body
 * @param {String} optFirstRowFixed 可选参数，决定在移动端显示时，是否将第一个区块固定在页面顶部,默认不固定
 */
function AutoLayout(
  layoutStr,
  optJsonData,
  optPrintKeyFlag = true,
  optRootElement,
  optFirstRowFixed = false
) {
  // 初始化基本设置
  this.layoutStr = layoutStr; // 必须的参数，通过此确认用户要设置的页面结构及元素数量
  this.optJsonData = optJsonData || {}; // 可选参数，如果如果用户传入了内容则按照用户传入的内容向页面结构中填充数据，必须是json格式，值可以是模板字符串或者纯文本
  this.optPrintKeyFlag = optPrintKeyFlag; // 可选参数，是否输出键，默认支持true
  this.optRootElement = optRootElement || "body"; // 可选参数，通过其确认最终生成的页面要输出到哪个页面元素中，如果不传入则默认设置为body标签中
  this.optFirstRowFixed = optFirstRowFixed; // 可选参数，决定在移动端显示时，是否将第一个区块固定在页面顶部
  // 初始化
  this.init();
}

/**
 * 初始化，调用对象中的方法创建对应布局
 */
AutoLayout.prototype.init = function() {
  this.setElements();
  this.setColWidth();
  this.setContent();
};

/**
 * 将用户输入的布局格式转换为页面布局
 */
AutoLayout.prototype.setElements = function() {
  // 初始化对照表==>一些文本内容应该转换为何种html元素
  let contrastSheet = {
    "-":
      '<div class="auto-layout-row clearfix"><div class="auto-layout-col" data-scale="1"></div></div>',
    "[": '<div class="auto-layout-row clearfix">',
    "]": "</div>"
  };

  // 创建页面元素
  let container = document.createElement("div");
  container.setAttribute("class", "auto-layout-container");

  // 初始化html模板存储空间
  let layoutHtmlStr = "";

  // 遍历模板字符串将结构渲染至页面中
  for (let i = 0; i < this.layoutStr.length; i++) {
    // 获取当前字符
    let current = this.layoutStr.charAt(i);

    // 需要计算比例的页面结构
    if (parseInt(current)) {
      // 完整的获取输入的比例值，确保两位数及以上不会被拆分
      let endStr1 = this.layoutStr.indexOf("|", i),
        endStr2 = this.layoutStr.indexOf("]", i),
        searchEnd =
          endStr1 === -1 ? endStr2 : endStr1 > endStr2 ? endStr2 : endStr1,
        scaleStr = this.layoutStr.substring(i, searchEnd);

      // 向每个元素添加其所占的宽度比例 ===> 如果获得的字符串无法被转换为数字就代表这个输入有误，不向页面中渲染该部分内容
      layoutHtmlStr += parseInt(scaleStr)
        ? '<div class="auto-layout-col" data-scale="' + scaleStr + '"></div>'
        : "";

      // 手动修改下一次循环的起始位置
      i += scaleStr.length - 1;
      continue;
    }

    // 不需要计算比例的页面结构
    // 防止输入中存在不符合要求的内容，避免解析时报错
    layoutHtmlStr += contrastSheet[current] ? contrastSheet[current] : "";
  }

  // 将页面结构渲染至页面中
  container.innerHTML = layoutHtmlStr;

  // 将生成的内容插入页面中
  document.querySelector(this.optRootElement).appendChild(container);
};

/**
 * 动态设置每个区块的宽度保证页面布局的稳定性
 */
AutoLayout.prototype.setColWidth = function() {
  // 动态设置需要计算比例的元素的宽度
  // 获取有子元素的行
  let rows = document.querySelectorAll(
    ".auto-layout-container .auto-layout-row"
  );

  // 如果页面中没有行，结束此功能
  if (rows.length < 1) return;

  // 遍历所有有子元素的行
  rows.forEach((ele, i) => {
    // if(i === 0){
    //   ele.setAttribute('class','row clearfix first-row')
    // }

    // 获取所有子元素==》行中的所有列
    let cols = ele.querySelectorAll(".auto-layout-col"),
      scaleCounter = 0; // 计数器==》用于统计每一行的比例之和

    // 如果没有需要的内容，结束本次循环
    if (cols.length < 1) return true;

    // 遍历所有列 确定这一行要被划分为多少列
    cols.forEach(col => {
      scaleCounter += parseInt(col.dataset.scale);
    });

    // 计算每一份的比例值
    let scaleOne = ((1 / scaleCounter) * 99.9).toFixed(2);

    //   动态设置比例+margin值
    cols.forEach(col => {
      col.style.width = col.dataset.scale * scaleOne + "%";
    });
  });
};

/**
 * 动态设置每个区块的内容
 */
AutoLayout.prototype.setContent = function() {
  // 获取要设置的元素
  let cols = document.querySelectorAll(
    ".auto-layout-container .auto-layout-col"
  );

  let dataKeyArr = Object.keys(this.optJsonData),
    dataHtmlStr = "", // 初始化存储内容html结构的空间
    len = dataKeyArr.length < cols.length ? dataKeyArr.length : cols.length; // 防止数据数量大于区块数导致的溢出报错

  // 根据内容数量渲染几个区域
  for (let i = 0; i < len; i++) {
    dataHtmlStr = "";
    // 解析数据并生成对应结构
    let data = this.optJsonData[dataKeyArr[i]];

    // 将键转换为标题输出
    dataHtmlStr += this.optPrintKeyFlag
      ? '<div class="content-header"><h2>' + dataKeyArr[i] + "</h2></div>"
      : "";
    dataHtmlStr += '<div class="content-body">';
    dataHtmlStr += this.getDataHtmlStr(data);
    dataHtmlStr += "</div>"; // 结束content-body

    // 渲染数据和结构到页面中
    cols[i].innerHTML = dataHtmlStr;
  }

  // 复制第一行并插入容器顶部，为了应对移动端第一行固定在页面顶部的问题
  if (this.optFirstRowFixed) {
    let rows = document.querySelectorAll(".auto-layout-row"),
      firstRow = rows[0],
      copyRow = firstRow.cloneNode(true);
    document.querySelector(".auto-layout-container").innerHTML =
      '<div class="auto-layout-row clearfix copy-first-row">' +
      copyRow.innerHTML +
      "</div>" +
      document.querySelector(".auto-layout-container").innerHTML;
  }
};

/**
 * setContent的依赖函数，data代表数据值，返回一个页面模板字符串
 */
AutoLayout.prototype.getDataHtmlStr = function(data) {
  let htmlStr = ""; // 初始化存储空间
  if (data.constructor === String || data.constructor === Number) {
    htmlStr += "<p>" + data + "</p>";
    return htmlStr;
  }

  if (data.constructor === Object) {
    htmlStr += "<div>";

    Object.keys(data).forEach(ele => {
      // 将键转换为标题输出
      htmlStr += this.optPrintKeyFlag ? "<h3>" + ele + "</h3>" : "";

      htmlStr += this.getDataHtmlStr(data[ele]);
    });

    htmlStr += "<hr></div>";

    return htmlStr;
  }

  if (data.constructor === Array) {
    htmlStr += "<div>";

    data.forEach(ele => {
      htmlStr += this.getDataHtmlStr(ele);
    });

    htmlStr += "</div>";

    return htmlStr;
  }
};
