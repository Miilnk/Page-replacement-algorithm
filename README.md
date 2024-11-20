# 页面置换算法模拟器

这是一个用于模拟和可视化展示常见页面置换算法的Web应用程序。该应用程序支持最佳置换算法(OPT)、先进先出算法(FIFO)和最近最久未使用算法(LRU)的模拟演示。

## 功能特点

- 支持三种经典页面置换算法：
  - 最佳置换算法 (OPT)
  - 先进先出算法 (FIFO)
  - 最近最久未使用算法 (LRU)
- 可自定义页框大小
- 支持手动输入页面引用序列
- 提供随机序列生成功能
- 实时显示页框状态变化
- 详细的统计信息展示：
  - 页错误次数
  - 页命中次数
  - 页错误率
- 完整的置换过程记录表格

## 使用说明

1. 设置页框大小：输入所需的页框数量
2. 输入页面引用序列：
   - 手动输入：在输入框中输入以空格分隔的数字序列
   - 随机生成：设置序列长度和页面范围，点击"生成随机序列"按钮
3. 选择要使用的页面置换算法
4. 点击"开始模拟"按钮查看算法执行过程
5. 使用"重置"按钮清除当前结果，开始新的模拟

## 技术实现

- 前端技术：
  - HTML5
  - CSS3
  - JavaScript (ES6+)
- 项目结构：
  - `index.html`: 页面结构
  - `styles.css`: 样式表
  - `script.js`: 算法实现和交互逻辑

## 算法说明

### 最佳置换算法 (OPT)
- 原理：选择未来最长时间内不会被访问的页面进行置换
- 特点：理论上可达到最低的页错误率，但在实际系统中难以实现

### 先进先出算法 (FIFO)
- 原理：选择在内存中停留时间最长的页面进行置换
- 特点：实现简单，但可能会出现Belady异常

### 最近最久未使用算法 (LRU)
- 原理：选择最长时间没有被访问的页面进行置换
- 特点：实现较为复杂，但性能较好，广泛应用于实际系统

## 本地运行

1. 克隆项目到本地
2. 使用浏览器打开`index.html`文件
3. 开始使用页面置换算法模拟器

## 注意事项

- 页面引用序列中的数字应为非负整数
- 建议页框大小设置在合理范围内（1-10）
- 页面范围建议不要过大，以保证较好的可视化效果 