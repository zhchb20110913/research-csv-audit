# Research CSV Audit

Research CSV Audit 是一个无第三方依赖的命令行工具，用于在分析前快速检查科研 CSV 数据。它会自动识别数值列，统计缺失值、均值、中位数、标准差和四分位数，并用 IQR 规则标记潜在异常值。

## 适用场景

- 实验数据导出后的快速质量检查
- 建模前发现缺失值和极端值
- 将可复现的数据审计结果保存为 Markdown 或 JSON

## 快速开始

环境要求：Node.js 20 或更高版本。

```bash
node bin/research-csv-audit.js samples/experiment.csv
```

将报告写入文件：

```bash
node bin/research-csv-audit.js samples/experiment.csv --output reports/audit.md
```

## 输出指标

每个自动识别出的数值列包含以下指标：

- 有效值数量与缺失值数量
- 均值、中位数、样本标准差
- 最小值、第一四分位数、第三四分位数、最大值
- 按 `Q1 - 1.5 × IQR` 与 `Q3 + 1.5 × IQR` 计算的潜在异常值数量

## 项目结构

```text
bin/       命令行入口
src/       CSV 解析与数据审计逻辑
test/      自动化测试
samples/   示例实验数据
```

## 测试

```bash
node --test
```

## 许可证

MIT

