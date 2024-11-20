class PageReplacement {
    constructor(frameSize) {
        this.frameSize = frameSize; // 页框大小
        this.frames = new Array(frameSize).fill(-1); // 初始化页框为空
        this.pageFaults = 0; // 页错误次数
        this.pageHits = 0; // 页命中次数
    }

    // 重置状态
    reset() {
        this.frames.fill(-1);
        this.pageFaults = 0;
        this.pageHits = 0;
    }

    // 查找页面是否在页框中
    findPage(page) {
        return this.frames.indexOf(page);
    }

    // 最佳置换算法 (OPT)
    // 原理：选择未来最长时间内不会被访问的页面进行置换
    OPT(pages, currentIndex) {
        const pageToAccess = pages[currentIndex]; // 当前要访问的页面
        const frameIndex = this.findPage(pageToAccess);

        // 如果页面已在内存中，计数命中
        if (frameIndex !== -1) {
            this.pageHits++;
            return {
                frames: [...this.frames],
                isPageFault: false
            }
        }

        // 页面不在内存中，计数缺页
        this.pageFaults++;
        // 查找空闲页框
        const emptyIndex = this.frames.indexOf(-1);

        // 如果有空闲页框，直接放入
        if (emptyIndex !== -1) {
            this.frames[emptyIndex] = pageToAccess;
        } else {
            // 查找未来最长时间不会使用的页面
            let farthest = -1;
            let replaceIndex = 0;

            // 对每个页框中的页面进行分析
            for (let i = 0; i < this.frameSize; i++) {
                let nextUse = pages.length; // 默认为序列长度（表示不会再次使用）
                // 向后查找页面下一次出现的位置
                for (let j = currentIndex + 1; j < pages.length; j++) {
                    if (pages[j] === this.frames[i]) {
                        nextUse = j;
                        break;
                    }
                }

                // 更新最远的界面
                if (nextUse > farthest) {
                    farthest = nextUse;
                    replaceIndex = i;
                }
            }
            // 替换选中的页面
            this.frames[replaceIndex] = pageToAccess;
        }

        return {
            frames: [...this.frames], // 返回当前页框状态的副本
            isPageFault: true // 标记为缺页
        }
    }

    // 先进先出算法（FIFO）
    // 原理：选择在内存中停留时间最长的页面进行置换
    FIFO(pages, currentIndex) {
        const pageToAccess = pages[currentIndex]; // 当前要访问的页面
        const frameIndex = this.findPage(pageToAccess);

        // 初始化在内存时间计数器
        if (!this.inHereTime) {
            this.inHereTime = new Array(this.frameSize).fill(0);
        }

        // 页面命中
        if (frameIndex !== -1) {
            this.pageHits++;
            // 更新所有页面的停留时间
            this.updateInHereTime(-1);
            return {
                frames: [...this.frames],
                isPageFault: false
            };
        }

        // 页面缺失
        this.pageFaults++;
        // 查找空闲页框
        const emptyIndex = this.frames.indexOf(-1);
        // 如果有空闲页框，直接放入
        if (emptyIndex !== -1) {
            this.frames[emptyIndex] = pageToAccess;
            this.updateInHereTime(emptyIndex);
        } else {
            // 查找停留时间最长的页面
            let maxTime = 0;
            let replaceIndex = 0;
            for (let i = 0; i < this.frameSize; i++) {
                if (this.inHereTime[i] > maxTime) {
                    maxTime = this.inHereTime[i];
                    replaceIndex = i;
                }
            }
            // 替换选中的页面
            this.frames[replaceIndex] = pageToAccess;
            this.updateInHereTime(replaceIndex);
        }

        // 返回结果
        return {
            frames: [...this.frames], // 返回当前页框状态的副本
            isPageFault: true // 标记为缺页
        }
    }

    // FIFO辅助方法：更新页面在内存中的时间
    updateInHereTime(index) {
        // 所有页面的停留时间增加
        for (let i = 0; i < this.frameSize; i++) {
            this.inHereTime[i]++;
        }
        // 新页面的停留时间重置为0
        if (index !== -1) {
            this.inHereTime[index] = 0;
        }
    }

    // 最近最久未使用算法 (LRU)，采用寄存器方式实现
    // 原理：选择最长时间没有被访问的页面进行置换
    LRU(pages, currentIndex) {
        const pageToAccess = pages[currentIndex]; // 当前要访问的页面
        const frameIndex = this.findPage(pageToAccess);

        // 初始化访问时间寄存器
        if (!this.lastAccessTime) {
            this.lastAccessTime = new Array(this.frameSize).fill(0);
        }

        // 页面命中
        if (frameIndex !== -1) {
            this.pageHits++;
            // 更新访问时间
            this.lastAccessTime[frameIndex] = currentIndex;
            return {
                frames: [...this.frames],
                isPageFault: false
            };
        }

        // 页面缺失
        this.pageFaults++;
        // 查找空闲页框
        const emptyIndex = this.frames.indexOf(-1);
        
        // 如果有空闲页框，直接放入
        if (emptyIndex !== -1) {
            this.frames[emptyIndex] = pageToAccess;
            this.lastAccessTime[emptyIndex] = currentIndex;
        } else {
            // 查找最久未使用的页面
            let leastRecentIndex = 0;
            let leastRecentTime = currentIndex;
            
            // 遍历寄存器找到最早的访问时间
            for (let i = 0; i < this.frameSize; i++) {
                if (this.lastAccessTime[i] < leastRecentTime) {
                    leastRecentTime = this.lastAccessTime[i];
                    leastRecentIndex = i;
                }
            }
            
            // 替换最久未使用的页面
            this.frames[leastRecentIndex] = pageToAccess;
            this.lastAccessTime[leastRecentIndex] = currentIndex;
        }

        return {
            frames: [...this.frames], // 返回当前页框状态的副本
            isPageFault: true // 标记为缺页
        };
    }
}

class UIController {
    // 构造函数
    constructor() {
        this.initializeElements(); // 初始化页面元素
        this.bindEvent(); // 绑定事件处理
    }

    // 初始化元素
    initializeElements() {
        // 输入部分
        this.frameSizeInput = document.getElementById('frameSize');     //页框大小
        this.pageSequenceInput = document.getElementById('pageSequence'); //页面引用序列

        // 随机生成序列
        this.seqLengthInput = document.getElementById('seqLength');     //序列长度
        this.pageRangeInput = document.getElementById('pageRange');     //页面范围

        // 算法选择
        this.algorithmSelect = document.getElementById('algorithm');    //选择算法

        // 按钮
        this.generateBtn = document.getElementById('generateBtn');     //生成随机序列按钮
        this.startBtn = document.getElementById('startBtn');             //开始模拟按钮
        this.resetBtn = document.getElementById('resetBtn');             //重置按钮

        // 结果展示
        this.framesContainer = document.getElementById('framesContainer'); //页框状态
        this.processTable = document.getElementById('processTable').getElementsByTagName('tbody')[0];       // 置换过程表格的tbody
        this.pageFaultsSpan = document.getElementById('pageFaults');       //页错误次数
        this.pageHitsSpan = document.getElementById('pageHits');           //页命中次数
        this.faultRateSpan = document.getElementById('faultRate');         //页错误率
    }

    // 绑定事件
    bindEvent() {
        this.generateBtn.addEventListener('click', () => this.generateRandomSequence()); // 生成随机序列
        this.startBtn.addEventListener('click', () => this.startSimulation());           // 开始模拟
        this.resetBtn.addEventListener('click', () => this.resetSimulation());         // 重置
    }

    // 生成随机序列
    generateRandomSequence() {
        const length = parseInt(this.seqLengthInput.value); // 序列长度
        const range = parseInt(this.pageRangeInput.value); // 页面范围
        const sequence = [];
        // 生成随机序列
        for (let i = 0; i < length; i++) {
            sequence.push(Math.floor(Math.random() * range));
        }
        this.pageSequenceInput.value = sequence.join(' '); // 将序列显示在输入框中
    }

    // 开始模拟
    startSimulation() {
        const frameSize = parseInt(this.frameSizeInput.value); // 获取页框大小
        const pages = this.pageSequenceInput.value.split(/\s+/).map(Number); // 获取页面序列
        const algorithm = this.algorithmSelect.value; // 获取选择的算法

        // 创建页面置换对象
        const pr = new PageReplacement(frameSize);
        this.processTable.innerHTML = ''; // 清空置换过程表格的tbody

        // 遍历每个页面引用
        pages.forEach((page, index) => {
            let result;
            // 根据选择的算法执行相应的页面置换
            switch (algorithm) {
                case 'OPT':
                    result = pr.OPT(pages, index); // 执行最佳置换算法
                    break;
                case 'FIFO':
                    result = pr.FIFO(pages, index); // 执行先进先出算法
                    break;
                case 'LRU':
                    result = pr.LRU(pages, index); // 执行最近最久未使用算法
                    break;
            }

            // 更新UI显示,包括页框状态、是否缺页等信息
            this.updateUI(page, result.frames, result.isPageFault);
        });

        // 更新统计信息
        this.updateStatistics(pr);
    }

    // 重置
    resetSimulation() {
        this.framesContainer.innerHTML = ''; // 清空页框状态
        this.processTable.innerHTML = ''; // 清空置换过程表格
        this.pageFaultsSpan.textContent = '0'; // 清空页错误次数
        this.pageHitsSpan.textContent = '0'; // 清空页命中次数
        this.faultRateSpan.textContent = '0%'; // 清空页错误率
    }

    // 更新UI
    updateUI(page, frames, isPageFault) {
        // 更新页框显示
        this.framesContainer.innerHTML = frames.map(frame => `<div class="frame">${frame === -1 ? '' : frame}</div>`).join('');

        // 更新置换过程表格
        // 在置换过程表格中插入新行
        const row = this.processTable.insertRow();
        // 第一列显示访问的页面号
        row.insertCell(0).textContent = page;
        // 第二列显示当前页框状态(过滤掉空页框-1后用逗号分隔)
        row.insertCell(1).textContent = frames.filter(f => f !== -1).join(', ');
        // 第三列显示是否发生缺页，根据isPageFault添加不同的CSS类
        row.insertCell(2).innerHTML = `<span class="${isPageFault ? 'page-fault' : 'page-hit'}">${isPageFault ? '是' : '否'}</span>`;
    }

    // 更新统计信息
    updateStatistics(pr) {
        this.pageFaultsSpan.textContent = pr.pageFaults; // 更新页错误次数
        this.pageHitsSpan.textContent = pr.pageHits; // 更新页命中次数
        // 计算页错误率
        const faultRate = (pr.pageFaults / (pr.pageFaults + pr.pageHits) * 100).toFixed(2);
        this.faultRateSpan.textContent = `${faultRate}%`;
    }
}

// 当DOM内容完全加载后执行初始化
// 创建一个新的UI控制器实例来处理:
// - 页面置换算法的选择和执行
// - 用户输入的验证和处理
// - 结果的展示和更新
// - 页框状态的可视化
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
})