import dayjs from 'dayjs';

// 全局变量
// form表单默认间距，span =8
export const defaultSpan = 8;
// 默认子表格间距
export const defaultColProps = {
  span: 24, 
  sm: { span: 22 }
};

// 根据工单导入时间计算来件天数，按自然日计算，导入当天为 0 天。
export function getImportDays(importTime?: string | number | Date | null): number | string {
  if (!importTime) {
    return '-';
  }
  const importDate = dayjs(importTime);
  if (!importDate.isValid()) {
    return '-';
  }
  return Math.max(0, dayjs().startOf('day').diff(importDate.startOf('day'), 'day'));
}
