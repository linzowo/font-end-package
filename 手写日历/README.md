# 日历插件

## 项目背景
通过不断思考常用组件的设计与制作，不断强化解决问题的思路，同时提高自己对于常用组件的认知方便以后在使用常用组件的时候做调整

## 项目概要
1. 这是一个日历组件，包括js和css文件两部分，配合使用才能达到预期效果

2. 可以根据输入的日期（目前格式固定），生成对应的日历，支持月份和年份切换

3. 生成效果如下：

   ![日历生成效果](https://m.qpic.cn/psb?/V11CA95048EY0H/62Utcb8VJo9dQHpE5Ncc3EH7BLY3NIkOOgTMnm5eYVc!/b/dFMBAAAAAAAA&bo=cQMpAgAAAAADB3s!&rf=viewer_4)



## 使用方法

1. 实例化对象

   ```javascript
   new Calendar(date, enFlag, rootElement);
   ```
   
2. 参数介绍

    ```javascript
    /**
     * 
     * @param {String} date 可选参数，日期字符串，格式为xxxx/xx/xx，默认为当前系统日期;
     
     * @param {Boolean} enFlag 可选参数，是否开启英文模式，默认为false；
     
     * @param {String} rootElement 可选参数，根元素的选择器，决定生成的日历最终渲染到那个页面元素中，默认为body；
     */
    ```
    
3. 方法说明
   
   1. 这个组件目前提供了7个方法，具体介绍如下
   
   2. Calendar.prototype.init()
   
      > 初始化方法,调用必须的一些方法,并动态获取一些必要元素
   
   3. Calendar.prototype.setElements()
   
      > 私有方法,动态设置日历结构,采用页面字符串的方式减少频繁的dom操作
   
   4. Calendar.prototype.setContent()
   
      > 设置页面内容,保证日历呈现的内容是正确的
   
   5. Calendar.prototype.setBtnEvent()
   
      > 为日历按钮(年月切换按钮)注册事件
   
   6. Calendar.prototype.setShowSelectedEvent()
   
      > 为日历中每个日期所在的td标签设置点击事件,当其被点击时弹出提示框,并为弹出框中的按钮注册点击事件
   
   7. Calendar.prototype.toggle()
   
      > 切换日历显示/隐藏状态
   
   8. Calendar.prototype.setDate(date)
   
      > 根据新的date参数刷新日历内容,如果date格式不符合xxxx/xx/xx则刷新为当前系统日期



## 上手

下载demo立即体验



## TODO

- 思考优化方向,以及兼容性问题

