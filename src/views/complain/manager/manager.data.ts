import { getCitySevenFiveList, getCommunityChildList, getCommunityList, getDictItems, getSecondTreeList } from '/@/api/common/api';
import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import dayjs, { Dayjs } from 'dayjs';
import { ref, h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { getProcessList } from './manager.api';
import { getDictItemsByCode } from '/@/utils/dict';
import { render } from '/@/utils/common/renderUtils';
import TicketRecord from './TicketRecord.vue';
import { defaultColProps, getImportDays } from '../shareInfo';

function treeToList(tree: any[]) {
  const list: any[] = [];
  function traverse(node) {
    list.push(node);
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  tree.forEach(traverse);
  return list;
}

// 基于工单接收的列定义，保持一致
export const columns: BasicColumn[] = [
  { title: 'id', dataIndex: 'id', width: 70 },
  { title: '来件天数', dataIndex: 'importTime', width: 100, customRender: ({ text }) => getImportDays(text) },
  {
    title: '数据来源',
    dataIndex: 'sourceType_dictText',
    width: 80,
    // customRender: ({ text }) => {
    //   return render.renderDict(text, 'biz_source_type');
    // },
  },
  {
    title: '案件标签',
    dataIndex: 'labelCode_dictText',
    width: 100,
    // customRender: ({ text }) => {
    //   return render.renderDict(text, 'biz_complaint_lavel');
    // },
  },
  { title: '案件编号', dataIndex: 'caseNumber', width: 120 },
  { title: '工单编号', dataIndex: 'workOrderNumber', width: 160 },
  { title: '来电人', dataIndex: 'callUserName', width: 120 },
  { title: '来电号码', dataIndex: 'callPhoneNumber', width: 160 },
  { title: '状态', dataIndex: 'processName', width: 100 },
  { title: '驳回原因', dataIndex: 'rejectReason', width: 200 },
  { title: '月次', dataIndex: 'monthCount', width: 80, slots: { customRender: 'monthCount' } },
  { title: '年次', dataIndex: 'yearCount', width: 80, slots: { customRender: 'yearCount' } },
  { title: '当前处理单位', dataIndex: 'orgName', width: 120 },
  { title: '标题', dataIndex: 'title', width: 180 },
  { title: '主要内容', dataIndex: 'mainContent', width: 200 },
  { title: '是否保留', dataIndex: 'retainFlag', width: 100,
     customRender({ text }) {
      return text == 1 ? '保留' : '剔除';
    },
  },
  {
    title: '重点工单',
    dataIndex: 'importFlag',
    width: 80,
    customRender({ text }) {
      return text == 1 ? '是' : '否';
    },
  },
  {
    title: '点单工单',
    dataIndex: 'pointFlag',
    width: 80,
    customRender({ text }) {
      return text == 1 ? '是' : '否';
    },
  },
  { title: '受理单位', dataIndex: 'acceptDepartment', width: 120 },
  { title: '反映管区', dataIndex: 'reportDistrictId_dictText', width: 120 },
  { title: '反映社区', dataIndex: 'reportCommunityId_dictText', width: 120 },
  { title: '市派单时间', dataIndex: 'cityDispatchTime', width: 160 },
  { title: '区派单时间', dataIndex: 'sendTime', width: 160 },
  { title: '一级分类', dataIndex: 'categoryOne', width: 120 },
  { title: '二级分类', dataIndex: 'categoryTwo', width: 120 },
  { title: '三级分类', dataIndex: 'categoryThree', width: 120 },
  { title: '处理科室', dataIndex: 'assignDepts', width: 150 },
  { title: '处理社区/居委会', dataIndex: 'assignCommunitys', width: 200 },
  { title: '办结时间', dataIndex: 'doneTime', width: 160 },
  { title: '截止时间', dataIndex: 'deadline', width: 170 },
  { title: '督办人', dataIndex: 'overseeUserName', width: 120 },
  {
    title: '是否解决',
    dataIndex: 'resolveFlag',
    width: 80,
    customRender: ({ text }) => {
      // 是否解决(-1默认;0否;1是)
      return text === 1 ? '已解决' : text === 0 ? '未解决' : '-';
    },
  },
  {
    title: '是否满意',
    dataIndex: 'satisfyFlag',
    width: 80,
    customRender: ({ text }) => {
      // 是否满意(-1默认;0否;1是)
      return text === 1 ? '满意' : text === 0 ? '不满意' : '-';
    },
  },
  {
    title: '是否响应',
    dataIndex: 'responseFlag',
    width: 80,
    customRender: ({ text }) => {
      // 	是否响应（0否;1是）
      return text === 1 ? '响应' : text === 0 ? '未响应' : '-';
    },
  },
  {
    title: '是否接收',
    dataIndex: 'receiveStatus_dictText',
    width: 80,
    //  customRender: ({ text }) => {
    //   // 是否已接收（0否;1是;-1已转出）
    //   return text === 1 ? '已接收' : (text === 0 ? '待接收' : '-');
    // }
  },
  { title: '跟进情况', dataIndex: 'followCode_dictText', width: 120 },
  {
    title: '案件性质',
    dataIndex: 'caseNature_dictText',
    width: 120,
    //  customRender: ({ text }) => {
    //   return render.renderDict(text, 'biz_case_nature');
    // },
  },
  {
    title: '案件类型',
    dataIndex: 'caseType_dictText',
    width: 120,
    //  customRender: ({ text }) => {
    //   return render.renderDict(text, 'biz_case_nature');
    // },
  },
  { title: '导入时间', dataIndex: 'importTime', width: 160 },
  { title: '来电时间', dataIndex: 'callTime', width: 160 },
  { title: '热线号码', dataIndex: 'hotlineNumber', width: 150 },
  { title: '联系方式', dataIndex: 'contactInfo', width: 150 },
  { title: '来电人地址', dataIndex: 'callUserAddress', width: 180 },
  { title: '问题分类', dataIndex: 'questionCategory', width: 120 },
  { title: '工单分类', dataIndex: 'workOrderCategory', width: 120 },
  { title: '书记批示', dataIndex: 'shujiSuggest', width: 150 },
  { title: '主任批示', dataIndex: 'zhurenSuggest', width: 150 },
  {
    title: '回访结果',
    dataIndex: 'upRevisitResultState',
    width: 120,
    customRender: ({ text }) => {
      return render.renderDict(text, 'biz_up_revisit_yes_no', true);
    },
  },
  { title: '发生地址', dataIndex: 'occurrenceAddress', width: 180 },
  // { title: '被反映单位', dataIndex: '', width: 120 },去掉
  { title: '派单人员', dataIndex: 'sendUser', width: 120 },
  { title: '处理意见', dataIndex: 'resolveOpinion', width: 180 },
  { title: '处理时限', dataIndex: 'resolveTimeLimit', width: 120 },
  { title: '承办单位', dataIndex: 'resolveDepartment', width: 150 },
  { title: '办理次数', dataIndex: 'resolveCount', width: 120 },
  { title: '审核时间', dataIndex: 'replyAuditTime', width: 200 },
  { title: '回访时间', dataIndex: 'visitTime', width: 200 },
  {
    title: '已倾听',
    dataIndex: 'fileRead',
    width: 100,
    customRender: ({ text }) => {
      // 录音是否已倾听(0否;1是)
      return text === 1 ? '已倾听' : text === 0 ? '未倾听' : '-';
    },
  },
  { title: '最终处理情况', dataIndex: 'finalResolveResult', width: 180 },
  { title: '修改人', dataIndex: 'updateBy', width: 120 },
  { title: '修改时间', dataIndex: 'updateTime', width: 200 },

  // { title: '创建人名称', dataIndex: 'createBy', width: 120 },
  // { title: '创建时间', dataIndex: 'createTime', width: 150 },
  // { title: '截止时间', dataIndex: 'deadline', width: 150 },
  // { title: '最终处理情况', dataIndex: 'finalResolveResult', width: 180 },
  // { title: '重点对象类型', dataIndex: 'monitorType', width: 150 },
  // { title: '所属部门', dataIndex: 'orgId', width: 150 },
  // { title: '原始标签', dataIndex: 'originalLabel', width: 120 },
  // { title: '流程节点编码', dataIndex: 'processCode', width: 150 },
  // { title: '流程节点名称', dataIndex: 'processName', width: 150 },
  // { title: '流程节点状态', dataIndex: 'processStatus', width: 150 },
  // { title: '是否已接收', dataIndex: 'receiveStatus', width: 120 },
  // { title: '驳回原因', dataIndex: 'rejectReason', width: 180 },
  // { title: '处理次数', dataIndex: 'resolveCount', width: 120 },
  // { title: '承办单位', dataIndex: 'resolveDepartment', width: 150 },
  // { title: '派单时间', dataIndex: 'sendTime', width: 150 },
  // { title: '派单人员', dataIndex: 'sendUser', width: 120 },
  // { title: '七有五性', dataIndex: 'sevenFiveId', width: 120 },
  // { title: '修改人名称', dataIndex: 'updateBy', width: 120 },
  // { title: '修改时间', dataIndex: 'updateTime', width: 150 },
  // { title: '工单分类', dataIndex: 'workOrderCategory', width: 150 },
  // { title: '主任批示', dataIndex: 'zhurenSuggest', width: 150 },
  // { title: '备注', dataIndex: 'remark', width: 180 },
];

// 日期范围预设
const rangePresets = ref([
  // { label: '今天', value: [dayjs().add(-1, 'd'), dayjs()] },
  { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
  { label: '近7天', value: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')] },
  { label: '近1个月', value: [dayjs().add(-1, 'M').startOf('day'), dayjs().endOf('day')] },
  { label: '近3个月', value: [dayjs().add(-3, 'M').startOf('day'), dayjs().endOf('day')] },
  //近一年
  { label: '近1年', value: [dayjs().add(-1, 'y').startOf('day'), dayjs().endOf('day')] },
]);

// 根据图片中的搜索条件定义表单
export const searchFormSchema: FormSchema[] = [
  {
    label: '案件标签',
    field: 'labelCode',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_complaint_lavel');
        // console.log(res)
        if (Array.isArray(res)) {
          res.unshift({ text: '所有', value: '' });
          return res;
        } else {
          return [];
        }
      },
      labelField: 'text',
      valueField: 'value',
    },
    colProps: { span: 8 },
  },
  {
    label: '数据来源',
    field: 'sourceType',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_source_type');
        if (Array.isArray(res)) {
          // res.unshift({ text: '==所有==', value: '' });
          return res;
        } else {
          return [];
        }
      },
      labelField: 'text',
      valueField: 'value',
      // placeholder: '==请选择==',
    },
    colProps: { span: 8 },
  },
  {
    label: '案件时间',
    field: 'importTime',
    component: 'RangePicker',
    componentProps: {
      presets: rangePresets,
      placeholder: ['开始日期', '结束日期'],
      allowClear: false,
      showTime: true, // 显示时间选择
    },
    colProps: { span: 8 },
    defaultValue: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')],
  },
  // 回访结果
  {
    label: '回访结果',
    field: 'upRevisitResultState',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_up_revisit_yes_no');
        if (Array.isArray(res)) {
          return res;
        } else {
          return [];
        }
      },
      labelField: 'text',
      valueField: 'value',
    },
    colProps: { span: 8 },
  },
  {
    label: '关键字',
    field: 'keywords',
    component: 'Input',
    componentProps: {
      placeholder: '标题\\内容\\来电号码\\发生地址',
    },
    colProps: { span: 8 },
  },
  {
    field: 'caseNature',
    label: '案件性质',
    component: 'ApiSelect',
    // required: true,
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_case_nature');
        // console.log(res)
        if (Array.isArray(res)) {
          return res.filter((item) => {
            return item.text !== '默认';
          });
        } else {
          return [];
        }
      },
      labelField: 'text',
      valueField: 'value',
    },
  },
  {
    label: '案件类型',
    field: 'caseType',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_case_category');
        if (Array.isArray(res)) {
          // res.unshift({ text: '==请选择==', value: '' });
          return res;
        } else {
          return [];
        }
      },
      labelField: 'text',
      valueField: 'value',
      // placeholder: '==请选择==',
    },
    colProps: { span: 8 },
  },
  {
    label: '案件编号',
    field: 'caseNumber',
    component: 'Input',
    componentProps: {
      placeholder: '请输入案件编号',
    },
    colProps: { span: 8 },
  },
  {
    label: '工单编号',
    field: 'workOrderNumber',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工单编号',
    },
    colProps: { span: 8 },
  },
  {
    label: '反映管区',
    field: 'reportDistrictId',
    component: 'ApiSelect',
    componentProps: ({ formActionType }) => {
      return {
        api: async () => {
          const res = await getCommunityList('3'); // 3表示管区
          console.log(res);
          if (Array.isArray(res)) {
            // res.unshift({label: '所有', value: ''})
            return res;
          } else {
            return [];
          }
        },
        onSelect: async (options, values) => {
          // console.log('onSelect', options, values, formActionType);
          const { updateSchema, setFieldsValue } = formActionType;
          const { value } = values;
          const res = await getCommunityChildList(value);
          // console.log(res)
          // 切换时清空社区数据
          setFieldsValue({
            reportCommunityId: '',
          });
          if (Array.isArray(res)) {
            // res.unshift({label: '所有', value: ''})
            updateSchema({
              field: 'reportCommunityId',
              componentProps: {
                options: res.map((v) => {
                  return {
                    label: v.departName,
                    value: v.id,
                  };
                }),
              },
            });
          } else {
            updateSchema({
              field: 'reportCommunityId',
              componentProps: {
                options: [],
              },
            });
          }
        },
        labelField: 'departName',
        valueField: 'id',
      };
    },
    colProps: { span: 8 },
  },
  {
    label: '反映社区',
    field: 'reportCommunityId',
    component: 'Select',
    componentProps: {
      options: [],
    },
    colProps: { span: 8 },
  },
  {
    label: '处理科室',
    field: 'assignDeptId',
    component: 'ApiCascader',
    componentProps: {
      api: async () => {
        const res = await getSecondTreeList('2'); // 2表示科室、部门
        if (Array.isArray(res)) {
          const newList = treeToList(res);
          return newList.map((v) => {
            return {
              id: v.id,
              parentId: v.parentId,
              label: v.title,
              value: v.id,
            };
          });
        } else {
          return [];
        }
      },
      labelField: 'label',
      valueField: 'value',
      placeholder: '==请选择==',
    },
    colProps: { span: 8 },
  },
  {
    label: () => h('span', {}, ['处理社区/', h('br'), '居委会']),
    field: 'assignCommunityId',
    component: 'ApiCascader',
    componentProps: {
      api: async () => {
        const res = await getSecondTreeList('3'); // 3表示管区、社区
        if (Array.isArray(res)) {
          const newList = treeToList(res);
          return newList.map((v) => {
            return {
              id: v.id,
              parentId: v.parentId,
              label: v.title,
              value: v.id,
            };
          });
        } else {
          return [];
        }
      },
      labelField: 'label',
      valueField: 'value',
      placeholder: '==请选择==',
    },
    colProps: { span: 8 },
  },
  {
    label: '工单状态',
    field: 'statusCode',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const res = await getProcessList();
        if (Array.isArray(res)) {
          // res.unshift({ valueName: '==请选择==', valueCode: '' });
          return res;
        } else {
          return [];
        }
      },
      labelField: 'valueName',
      valueField: 'valueCode',
      // placeholder: '==请选择==',
    },
    colProps: { span: 8 },
  },
  {
    label: '办结时间',
    field: 'doneTime',
    component: 'RangePicker',
    componentProps: {
      presets: rangePresets,
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
  {
    label: '派单时间',
    field: 'sendTime',
    component: 'RangePicker',
    componentProps: {
      presets: rangePresets,
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },
  {
    label: () => h('span', {}, ['回复审核', h('br'), '时间']),
    field: 'replyAuditTime',
    component: 'RangePicker',
    componentProps: {
      presets: rangePresets,
      placeholder: ['开始日期', '结束日期'],
    },
    colProps: { span: 8 },
  },

  {
    label: '标题',
    field: 'title',
    component: 'Input',
    componentProps: {
      placeholder: '请输入标题',
    },
    colProps: { span: 8 },
  },
  {
    label: '主要内容',
    field: 'mainContent',
    component: 'Input',
    componentProps: {
      placeholder: '请输入关键词搜索',
    },
    colProps: { span: 8 },
  },
  {
    label: '是否解决',
    field: 'resolveFlag',
    component: 'Select',
    componentProps: {
      options: [
        { label: '已解决', value: '1' },
        { label: '未解决', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '是否满意',
    field: 'satisfyFlag',
    component: 'Select',
    componentProps: {
      options: [
        { label: '满意', value: '1' },
        { label: '不满意', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '是否属实',
    field: 'factFlag',
    component: 'Select',
    componentProps: {
      options: [
        { label: '属实', value: '1' },
        { label: '不属实', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '是否保留',
    field: 'retainFlag',
    component: 'Select',
    componentProps: {
      options: [
        { label: '保留', value: 1 },
        { label: '剔除', value: 0 },
      ],
      allowClear: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '重点对象',
    field: 'monitorType',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_monitor_type');
        if (Array.isArray(res)) {
          res.unshift({ text: '==请选择==', value: '' });
          return res;
        } else {
          return [];
        }
      },
      labelField: 'text',
      valueField: 'value',
    },
    colProps: { span: 8 },
  },
  {
    label: '二次办理',
    field: 'resolveCount',
    component: 'Select',
    componentProps: {
      options: [
        { label: '一次办理', value: '1' },
        { label: '二次办理', value: '2' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    label: '录音已倾听',
    field: 'fileRead',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
  // {
  //   label: '七有五性',
  //   field: 'sevenFiveId',
  //   component: 'ApiTreeSelect',
  //   componentProps: {
  //     api: async () => {
  //       const res = await getQywxTreeList();
  //       console.log(res)
  //       if (Array.isArray(res)) {
  //         // res.unshift({text: '==请选择==', value: ''})
  //         return res.map(v => {
  //           return {
  //             id: v.id,
  //             pId: v.parentId,
  //             title: v.liveHoodIssueNames,
  //             value: v.id,
  //           }
  //         });
  //       } else {
  //         return [];
  //       }
  //     },
  //     treeDataSimpleMode: true,
  //   },
  //   colProps: { span: 8 },
  // },
  {
    field: 'sevenFiveId',
    label: '七有五性',
    component: 'ApiCascader',
    componentProps: {
      api: async () => {
        const res = await getCitySevenFiveList();
        // console.log(res)
        if (Array.isArray(res)) {
          return res;
        } else {
          return [];
        }
      },
      labelField: 'name',
      valueField: 'id',
      treeDataSimpleMode: true,
    },
    colProps: { span: 8 },
  },
  {
    label: '一级分类',
    field: 'categoryOne',
    component: 'Input',
    componentProps: {
      placeholder: '请输入一级分类',
    },
    colProps: { span: 8 },
  },
  {
    label: '二级分类',
    field: 'categoryTwo',
    component: 'Input',
    componentProps: {
      placeholder: '请输入二级分类',
    },
    colProps: { span: 8 },
  },
  {
    label: '三级分类',
    field: 'categoryThree',
    component: 'Input',
    componentProps: {
      placeholder: '请输入三级分类',
    },
    colProps: { span: 8 },
  },
  // 重点工单
  {
    label: '重点工单',
    field: 'importFlag',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
  // 点单工单
  {
    label: '点单工单',
    field: 'pointFlag',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
];

// 表单数据，用于编辑和新增
export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: 'ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'sourceType',
    label: '数据来源',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_source_type');
        console.log(res);
        if (Array.isArray(res)) {
          return res.map((v) => {
            return {
              ...v,
              value: +v.value, // 确保value是数字类型
            };
          });
        } else {
          return [];
        }
      },
    },
  },
  {
    field: 'caseNumber',
    label: '案件编号',
    component: 'Input',
    required: true,
  },
  {
    field: 'workOrderNumber',
    label: '工单编号',
    component: 'Input',

    required: true,
  },
  {
    field: 'importTime',
    label: '导入时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'callTime',
    label: '来电时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'hotlineNumber',
    label: '热线号码',
    component: 'Input',
  },

  {
    field: 'acceptDepartment',
    label: '受理单位',
    component: 'Input',
  },
  {
    field: 'callUserName',
    label: '来电人',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '请输入来电人',
    },
  },
  {
    field: 'callPhoneNumber',
    label: '来电号码',
    component: 'Input',
    // rules: [{ required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码格式有误' }],
    required: true,
    componentProps: {
      placeholder: '请输入来电号码',
    },
  },
  {
    field: 'callUserAddress',
    label: '来电人地址',
    component: 'Input',
    componentProps: {
      placeholder: '请输入来电人地址',
    },
  },
  {
    field: 'workOrderCategory',
    label: '工单分类',
    component: 'Input',
    componentProps: {
      placeholder: '请输入工单分类',
    },
  },
  {
    field: 'questionCategory',
    label: '问题分类',
    component: 'Input',
    componentProps: {
      placeholder: '请输入问题分类',
    },
  },
  {
    field: 'occurrenceAddress',
    label: '发生地址',
    component: 'Input',
    componentProps: {
      placeholder: '请输入发生地址',
    },
  },
  {
    field: 'categoryOne',
    label: '一级分类',
    component: 'Input',
  },
  {
    field: 'categoryTwo',
    label: '二级分类',
    component: 'Input',
  },
  {
    field: 'categoryThree',
    label: '三级分类',
    component: 'Input',
    colProps: { span: 16 },
    itemProps: {
      wrapperCol: { span: 16, sm: { span: 21 } },
    },
  },
  {
    field: 'title',
    label: '标题',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      rows: 3,
      placeholder: '请输入标题',
    },
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { ...defaultColProps },
    },
  },
  {
    field: 'mainContent',
    label: '主要内容',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      rows: 6,
      placeholder: '请输入主要内容',
    },
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { ...defaultColProps },
    },
  },
  {
    label: '重点工单',
    field: 'importFlag',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    label: '点单工单',
    field: 'pointFlag',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    label: '是否保留',
    field: 'retainFlag',
    component: 'Select',
    componentProps: {
      options: [
        { label: '保留', value: 1 },
        { label: '剔除', value: 0 },
      ],
    }
  },
  {
    field: 'sendUser',
    label: '派单人员',
    component: 'Input',
  },
  {
    field: 'sendTime',
    label: '派单时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'deadline',
    label: '截止时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    field: 'resolveTimeLimit',
    label: '处理时限',
    component: 'Input',
    // componentProps: {
    //   min: 1,
    //   addonAfter: '天',
    // },
  },
  {
    field: 'resolveDepartment',
    label: '承办单位',
    component: 'Input',
    // colProps: { span: 16 },
    // itemProps: {
    //   wrapperCol: { span: 16, sm: { span: 21 } },
    // },
  },
  {
    field: 'resolveOpinion',
    label: '处理意见',
    component: 'InputTextArea',
    componentProps: {
      rows: 4,
      placeholder: '请输入处理意见',
    },
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { ...defaultColProps },
    },
  },
  {
    field: 'finalResolveResult',
    label: '最终处理情况',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      rows: 4,
      placeholder: '请输入最终处理情况',
    },
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { ...defaultColProps },
    },
  },
];

// 待补充表单
export const addFormSchema: FormSchema[] = [
  {
    field: 'labelCode',
    label: '标签',
    component: 'RadioGroup',
    componentProps: {
      options: getDictItemsByCode('biz_complaint_lavel'),
    },
    defaultValue: '1',
    required: true,
  },
  {
    field: 'reportDistrictId',
    label: '反映管区',
    component: 'ApiSelect',
    required: true,
    componentProps: ({ formActionType }) => {
      return {
        api: async () => {
          const res = await getCommunityList('3'); // 3表示管区
          console.log(res);
          if (Array.isArray(res)) {
            // res.unshift({label: '所有', value: ''})
            return res;
          } else {
            return [];
          }
        },
        onSelect: async (options, values) => {
          console.log(options, values);
          const { updateSchema, setFieldsValue } = formActionType;
          const { value } = values;
          const res = await getCommunityChildList(value);
          // console.log(res)
          if (Array.isArray(res)) {
            // res.unshift({label: '所有', value: ''})
            updateSchema({
              field: 'reportCommunityId',
              componentProps: {
                options: res.map((v) => {
                  return {
                    label: v.departName,
                    value: v.id,
                  };
                }),
              },
            });
          } else {
            updateSchema({
              field: 'reportCommunityId',
              componentProps: {
                options: [],
              },
            });
          }
        },
        labelField: 'departName',
        valueField: 'id',
      };
    },
  },
  {
    field: 'reportCommunityId',
    label: '反映社区',
    component: 'Select',
    required: true,
    componentProps: {
      options: [],
    },
  },
  {
    field: 'assignDeptIdList',
    label: '处理科室',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: async () => {
        const res = await getCommunityList('2'); // 2表示部门
        if (Array.isArray(res)) {
          return res;
        } else {
          return [];
        }
      },
      labelField: 'departName',
      valueField: 'id',
      mode: 'multiple',
    },
  },
  {
    field: 'assignCommunityIdList',
    label: '处理社区/居委会',
    component: 'ApiCascader',
    required: true,
    componentProps: {
      checkable: true,
      multiple: true,
      api: async () => {
        const res = await getSecondTreeList('3');
        // console.log(res)
        if (Array.isArray(res)) {
          // 把tree格式数据展开
          const newList = treeToList(res);
          return newList.map((v) => {
            return {
              id: v.id,
              parentId: v.parentId,
              label: v.title,
              value: v.id,
            };
          });
        } else {
          return [];
        }
      },
      treeDataSimpleMode: true,
      showCheckedStrategy: 'Cascader.SHOW_CHILD',
    },
    // treeDataSimpleMode: true,
  },
  {
    field: 'sevenFiveId',
    label: '七有五性',
    component: 'ApiCascader',
    required: true,
    componentProps: {
      api: async () => {
        const res = await getCitySevenFiveList();
        // console.log(res)
        if (Array.isArray(res)) {
          return res;
        } else {
          return [];
        }
      },
      labelField: 'name',
      valueField: 'id',
      treeDataSimpleMode: true,
    },
  },
  // 案件性质
  {
    field: 'caseNature',
    label: '案件性质',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_case_nature');
        // console.log(res)
        if (Array.isArray(res)) {
          return res;
        } else {
          return [];
        }
      },
      labelField: 'text',
      valueField: 'value',
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
    componentProps: {
      rows: 3,
      placeholder: '请输入备注',
      style: { width: '100%' },
    },
  },
];

// 工单历史记录
// createTime	创建时间，排序
// orgId	所属部门
// createBy	创建人
// dataChangeJson	数据变更json ，自定义render，toolTip显示
// dataName	数据名称
// remark	备注
export const ticketRecordListColumns: BasicColumn[] = [
  // { title: 'ID', dataIndex: 'id', width: 70, fixed: 'left' },
  { title: '操作时间', dataIndex: 'createTime', width: 160 },
  { title: '操作节点', dataIndex: 'remark', width: 150, ellipsis: true },
  { title: '操作人', dataIndex: 'createBy', width: 120, ellipsis: true },
  { title: '所属部门', dataIndex: 'orgId_dictText', width: 120, ellipsis: true },
  { title: '数据名称', dataIndex: 'dataName', width: 140, ellipsis: true },
  {
    title: '数据变更',
    dataIndex: 'dataChangeJson',
    width: 100,
    ellipsis: true,
    customRender: ({ text }) => {
      return h(
        Tooltip,
        {
          title: h(TicketRecord, {
            jsonStr: text,
            maxHeight: 300,
            columns: [
              { title: '字段名', dataIndex: 'fieldZhName', width: 120 },
              { title: '旧值', dataIndex: 'oldValue', width: 200, ellipsis: true },
              { title: '新值', dataIndex: 'newValue', width: 200, ellipsis: true },
            ],
          }),
          placement: 'topRight',
          autoAdjustOverflow: true,
          overlayClassName: 'tooltip-wrapper',
          overlayInnerStyle: { padding: '20px', backgroundColor: '#fff', color: '#333' },
        },
        {
          default: () =>
            h(
              'span',
              {
                style: { cursor: 'pointer', color: '#1677ff' },
              },
              '详情'
            ),
        }
      );
    },
  },
];
