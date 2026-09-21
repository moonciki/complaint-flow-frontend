import {
  getBackDepartList,
  getCitySevenFiveList,
  getCommunityChildList,
  getCommunityList,
  getDictItems,
  getDistrictDictByCode,
  getSecondTreeList,
} from '/@/api/common/api';
import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import dayjs, { Dayjs } from 'dayjs';
import { ref, h } from 'vue';
import { render } from '/@/utils/common/renderUtils';
import { getDictItemsByCode } from '/@/utils/dict';
import { getDateDiff } from '/@/utils/dateUtil';
import { defaultColProps, getImportDays } from '../shareInfo';
// acceptDepartment	受理单位	string
// assignCommunitys	处理社区(名称逗号拼接)	string
// assignDepts	处理科室(名称逗号拼接)	string
// callPhoneNumber	来电号码	string
// callTime	来电时间	string
// callUserAddress	来电人地址	string
// callUserName	来电人	string
// caseNumber	案件编号	string
// categoryOne	一级分类	string
// categoryThree	三级分类	string
// categoryTwo	二级分类	string
// contactInfo	联系方式	string
// createBy	创建人名称	string
// createTime	创建时间	string
// createUserId	创建人id	string
// deadline	截止时间	string
// finalResolveResult	处理情况	string
// hotlineNumber	热线号码	string
// id	id	integer
// importTime	工单导入时间	string
// labelCode	标签code	integer
// mainContent	主要内容	string
// monitorType	重点对象类型(0普通;其他)	integer
// monthCount	月次	integer
// occurrenceAddress	发生地址	string
// orgId	所属部门	string
// originalLabel	原始标签	string
// processCode	流程节点编码	string
// processName	流程节点名称	string
// processStatus	流程节点状态，不需要审批的节点直接通过（-1审核不通过;0待审核;1审核通过）	integer
// questionCategory	问题分类	string
// receiveStatus	是否已接收（0否;1是）	integer
// rejectReason	驳回原因	string
// remark	备注	string
// reportCommunityId	反映社区	string
// reportDistrictId	反映管区	string
// resolveCount	处理次数	integer
// resolveDepartment	承办单位	string
// resolveOpinion	处理意见	string
// resolveTimeLimit	处理时限	integer
// sendTime	派单时间	string
// sendUser	派单人员	string
// sevenFiveId	七有五性	integer
// sourceType	数据来源(0本地录入;1区分转;2直派)	integer
// title	标题	string
// updateBy	修改人名称	string
// updateTime	修改时间	string
// updateUserId	修改人id	string
// workOrderCategory	工单分类	string
// workOrderNumber	工单编号	string
// yearCount	年次    integer

//根据上面的内容生成表格的columns和搜索表单的schema
export const columns: BasicColumn[] = [
  { title: 'id', dataIndex: 'id', width: 70 },
  // 紧急程度
  {
    title: '紧急程度',
    dataIndex: 'emergencyLevel',
    width: 80,
    customRender: ({ record }) => {
      let text = '';
      let color = '';
      const array = getDictItemsByCode('biz_time_level') || [];
      const obj = array.filter((item) => {
        return item.value == record.timeLevel + '';
      });
      if (obj[0]) {
        text = obj[0].text;
        color = obj[0].color;
        return render.renderTag(text, color);
      } else {
        return text;
      }
    },
  },
  { title: '来件天数', dataIndex: 'importTime', width: 100, customRender: ({ text }) => getImportDays(text) },
  {
    title: '剩余待处置时间',
    dataIndex: 'remainingTime',
    width: 130,
    customRender: ({ record }) => {
      if (!record.deadline || !dayjs(record.deadline).isValid()) {
        return '';
      }
      // const remainingTime = dayjs(record.deadline).subtract(1, 'day').diff(dayjs(), 'day');
      const expireDate = dayjs(record.deadline).subtract(1, 'day');
      const { expires, days, hours } = getDateDiff(expireDate);
      // 如果小于等于0，超时用红色，不超时用绿色tag
      if (expires) {
        return h('span', { style: { color: '#cf1322' } }, `超期${days}天${hours}小时`);
      }
      return h('span', { style: { color: '#389e0d' } }, `剩余${days}天${hours}小时`);
    },
  },
  {
    title: '数据来源',
    dataIndex: 'sourceType',
    width: 80,
    customRender: ({ text }) => {
      return render.renderDict(text, 'biz_source_type');
    },
  },
  { title: '案件标签', dataIndex: 'labelCode_dictText', width: 100 },
  { title: '案件编号', dataIndex: 'caseNumber', width: 120 },
  { title: '工单编号', dataIndex: 'workOrderNumber', width: 160 },
  { title: '来电人', dataIndex: 'callUserName', width: 120 },
  { title: '来电号码', dataIndex: 'callPhoneNumber', width: 110 },
  { title: '状态', dataIndex: 'processName', width: 100 },
  { title: '驳回原因', dataIndex: 'rejectReason', width: 180 },
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
  { title: '反映社区', dataIndex: 'reportCommunityId_dictText', width: 120 },
  { title: '反映管区', dataIndex: 'reportDistrictId_dictText', width: 120 },
  { title: '处理社区', dataIndex: 'assignCommunitys', width: 150 },
  { title: '处理科室', dataIndex: 'assignDepts', width: 150 },
  { title: '来电时间', dataIndex: 'callTime', width: 160 },
  { title: '来电人地址', dataIndex: 'callUserAddress', width: 180 },
  { title: '一级分类', dataIndex: 'categoryOne', width: 120 },
  { title: '三级分类', dataIndex: 'categoryThree', width: 120 },
  { title: '二级分类', dataIndex: 'categoryTwo', width: 120 },
  { title: '联系方式', dataIndex: 'contactInfo', width: 150 },
  { title: '创建人名称', dataIndex: 'createBy', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 160 },
  { title: '市派单时间', dataIndex: 'cityDispatchTime', width: 160 },
  { title: '截止时间', dataIndex: 'deadline', width: 170 },
  { title: '处理情况', dataIndex: 'finalResolveResult', width: 180 },
  { title: '热线号码', dataIndex: 'hotlineNumber', width: 150 },
  { title: '工单导入时间', dataIndex: 'importTime', width: 160 },
  { title: '重点对象类型', dataIndex: 'monitorType_dictText', width: 150 },
  { title: '发生地址', dataIndex: 'occurrenceAddress', width: 180 },
  { title: '所属部门', dataIndex: 'orgName', width: 150 },
  { title: '原始标签', dataIndex: 'originalLabel', width: 120 },
  // { title: '流程节点编码', dataIndex: 'processCode', width: 150 },
  { title: '流程节点名称', dataIndex: 'processName', width: 150 },
  // { title: '流程节点状态', dataIndex: 'processStatus', width: 150 },
  { title: '问题分类', dataIndex: 'questionCategory', width: 120 },
  // { title: '是否已接收', dataIndex: 'receiveStatus', width: 120 },
  { title: '处理次数', dataIndex: 'resolveCount', width: 100 },
  { title: '承办单位', dataIndex: 'resolveDepartment', width: 120 },
  { title: '处理意见', dataIndex: 'resolveOpinion', width: 180 },
  { title: '处理时限', dataIndex: 'resolveTimeLimit', width: 120 },
  { title: '派单时间', dataIndex: 'sendTime', width: 160 },
  { title: '派单人员', dataIndex: 'sendUser', width: 120 },
  { title: '七有五性', dataIndex: 'sevenFiveId_dictText', width: 120 },
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
  //caseNature（案件性质）
  { title: '案件性质', dataIndex: 'caseNature_dictText', width: 120 },
  // caseType（案件类型）
  { title: '案件类型', dataIndex: 'caseType_dictText', width: 120 },
  // suddenCase（突发案件）
  { title: '突发案件', dataIndex: 'suddenCase', width: 120 },
  { title: '修改人名称', dataIndex: 'updateBy', width: 120 },
  { title: '修改时间', dataIndex: 'updateTime', width: 160 },
  { title: '备注', dataIndex: 'remark', width: 180 },
];

const rangePresets = ref([
  // { label: '今天', value: [dayjs().add(-1, 'd'), dayjs()] },
  { label: '今天', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
  { label: '近7天', value: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')] },
  { label: '近1个月', value: [dayjs().add(-1, 'M').startOf('day'), dayjs().endOf('day')] },
  { label: '近3个月', value: [dayjs().add(-3, 'M').startOf('day'), dayjs().endOf('day')] },
  //近一年
  { label: '近1年', value: [dayjs().add(-1, 'y').startOf('day'), dayjs().endOf('day')] },
]);

export const searchFormSchema: FormSchema[] = [
  {
    label: '工单编号',
    field: 'workOrderNumber',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '案件标签',
    field: 'labelCode',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_complaint_lavel');
        console.log(res);
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
    colProps: { span: 6 },
  },
  {
    label: '状态',
    field: 'assignStatus',
    component: 'Select',
    componentProps: {
      options: [
        { label: '待分派', value: '0' },
        { label: '已分派', value: '1' },
      ],
      allowClear: false,
    },
    colProps: { span: 6 },
    defaultValue: '0',
  },
  {
    label: '数据来源',
    field: 'sourceType',
    component: 'ApiSelect',
    componentProps: {
      // options: [
      //     { label: '所有', value: '' },
      //     { label: '本地录入', value: '0' },
      //     { label: '区分转', value: '1' },
      //     { label: '直派', value: '2' },
      // ],
      api: async () => {
        const res = await getDictItems('biz_source_type');
        console.log(res);
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
    colProps: { span: 6 },
  },
  {
    label: '导入时间',
    field: 'importTime',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      presets: rangePresets,
      allowClear: false,
      showTime: true,
    },
    defaultValue: [dayjs().add(-7, 'd').startOf('day'), dayjs().endOf('day')],
  },
  {
    label: '派单时间',
    field: 'sendTime',
    component: 'RangePicker',
    colProps: { span: 6 },
    componentProps: {
      presets: rangePresets,
      allowClear: false,
    },
  },
  {
    label: '关键字',
    field: 'keywords',
    component: 'Input',
    componentProps: {
      placeholder: '标题\\内容\\来电号码\\发生地址',
    },
    colProps: { span: 6 },
  },
  {
    label: '案件编号',
    field: 'caseNumber',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '标题',
    field: 'title',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '主要内容',
    field: 'mainContent',
    component: 'Input',
    colProps: { span: 6 },
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
    colProps: { span: 6 },
  },
  {
    label: '重点对象',
    field: 'monitorType',
    component: 'ApiSelect',
    componentProps: {
      // options: [
      //     { label: '==请选择==', value: '' },
      //     { label: '红名单', value: '0' },
      //     { label: '黑名单', value: '1' },
      //     { label: '失信名单', value: '3' },
      // ],
      api: async () => {
        const res = await getDictItems('biz_monitor_type');
        console.log(res);
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
    colProps: { span: 6 },
  },
];

// 新增或者编辑表单项
export const formSchema: FormSchema[] = [
  {
    label: '数据来源',
    field: 'sourceType',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: async () => {
        const res = await getDictItems('biz_source_type');
        if (Array.isArray(res)) {
          return res.map((item) => {
            return {
              text: item.text,
              value: +item.value,
            };
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
    label: '工单编号',
    field: 'workOrderNumber',
    component: 'Input',
    required: true,
  },
  {
    label: '案件编号',
    field: 'caseNumber',
    component: 'Input',
    required: true,
  },
  {
    label: '导入时间',
    field: 'importTime',
    component: 'RangePicker',
    componentProps: {
      presets: rangePresets,
      style: { width: '100%' },
    },
  },
  {
    label: '案件编号',
    field: 'caseNumber',
    component: 'Input',
    required: true,
  },
  {
    label: '导入时间',
    field: 'importTime',
    component: 'RangePicker',
    componentProps: {
      presets: rangePresets,
      style: { width: '100%' },
    },
    required: true,
  },
  {
    label: '来电时间',
    field: 'callTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  {
    label: '热线号码',
    field: 'hotlineNumber',
    component: 'Input',
  },
  {
    label: '受理单位',
    field: 'acceptDepartment',
    component: 'Input',
  },
  {
    label: '来电人',
    field: 'callUserName',
    component: 'Input',
    required: true,
  },
  {
    label: '来电号码',
    field: 'callPhoneNumber',
    component: 'Input',
    required: true,
  },
  {
    label: '联系方式',
    field: 'contactInfo',
    component: 'Input',
  },
  {
    label: '来电人地址',
    field: 'callUserAddress',
    component: 'Input',
  },
  {
    label: '发生地址',
    field: 'occurrenceAddress',
    component: 'Input',
  },
  {
    label: '问题分类',
    field: 'questionCategory',
    component: 'Input',
  },
  {
    label: '工单分类',
    field: 'workOrderCategory',
    component: 'Input',
    required: true,
  },
  {
    label: '一级分类',
    field: 'categoryOne',
    component: 'Input',
    required: true,
  },
  {
    label: '二级分类',
    field: 'categoryTwo',
    component: 'Input',
  },
  {
    label: '三级分类',
    field: 'categoryThree',
    component: 'Input',
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { ...defaultColProps },
    },
  },
  {
    label: '标题',
    field: 'title',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      rows: 3,
      placeholder: '请输入标题',
      style: { width: '100%' },
    },
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { ...defaultColProps },
    },
  },
  {
    label: '主要内容',
    field: 'mainContent',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      rows: 6,
      placeholder: '请输入主要内容',
      style: { width: '100%' },
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
    label: '派单人员',
    field: 'sendUser',
    component: 'Input',
  },
  {
    label: '派单时间',
    field: 'sendTime',
    component: 'DatePicker',
    required: true,
  },
  {
    label: '处理意见',
    field: 'resolveOpinion',
    component: 'Input',
  },
  {
    label: '截止时间',
    field: 'deadline',
    component: 'DatePicker',
    required: true,
  },
  {
    label: '处理时限',
    field: 'resolveTimeLimit',
    component: 'Input',
  },
  {
    label: '承办单位',
    field: 'resolveDepartment',
    component: 'Input',
    colProps: { span: 16 },
  },
  {
    label: '处理情况',
    field: 'finalResolveResult',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      rows: 3,
      placeholder: '请输入处理情况',
      style: { width: '100%' },
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
    componentProps: ({ formActionType, formModel }) => {
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
          const { updateSchema } = formActionType;
          const { value } = values;
          const res = await getCommunityChildList(value);
          // console.log(res)
          formModel.reportCommunityId = null; // 清空反映社区
          if (Array.isArray(res)) {
            // res.unshift({label: '所有', value: ''})
            updateSchema({
              field: 'reportCommunityId',
              required: true,
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
              required: true,
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
    // required: true,
    componentProps: {
      options: [],
    },
  },
  {
    field: 'assignDeptIdList',
    label: '处理科室',
    component: 'ApiSelect',
    // required: true,
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
    // required: true,
    componentProps: ({ formModel }) => {
      return {
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
        onChange: (values, options) => {
          console.log(values, options);
          // formModel.communityList = values;
        },
        treeDataSimpleMode: true,
        // showCheckedStrategy: 'Cascader.SHOW_CHILD'
      };
    },
    // treeDataSimpleMode: true,
  },
  {
    field: 'sevenFiveId',
    label: '七有五性',
    component: 'ApiCascader',
    // required: true,
    componentProps: ({ formModel }) => {
      return {
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
        changeOnSelect: false,
        onChange: (values, options) => {
          console.log(values, options);
          // formModel.sevenFiveList = values;
        },
      };
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

// 工单转出表单
export const forwardFormSchema: FormSchema[] = [
  // 转出位置
  {
    field: 'forwardType',
    label: '转出位置',
    component: 'Select',
    componentProps: {
      placeholder: '请输入转出位置',
      options: [
        { value: 'city', label: '转出到市' },
        { value: 'district', label: '转出到区' },
      ],
    },
    required: true,
    defaultValue: 'city',
    colProps: { span: 12 },
  },
  // 退回类型
  {
    field: 'backType',
    label: '退回类型',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入退回类型',
      api: () => getDistrictDictByCode('back_type'),
      labelField: 'name',
      valueField: 'id',
      showSearch: true,
    },
    required: true,
    ifShow: ({ values }) => {
      return values.forwardType === 'city';
    },
    colProps: { span: 12 },
  },
  // 退回单位
  {
    field: 'adviceOffice',
    label: '退回单位',
    component: 'ApiSelect',
    componentProps: {
      placeholder: '请输入退回单位',
      api: getBackDepartList,
      labelField: 'name',
      valueField: 'id',
      showSearch: true,
    },
    required: true,
    ifShow: ({ values }) => {
      return values.forwardType === 'district';
    },
    colProps: { span: 12 },
  },
  // 退回原因
  {
    field: 'backReason',
    label: '退回原因',
    component: 'InputTextArea',
    componentProps: {
      rows: 3,
      maxLength: 800,
      placeholder: '请输入退回原因',
      style: { width: '100%' },
    },
    required: true,
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { span: 24, sm: { span: 21 } },
    },
  },
  // 上传附件
  {
    field: 'replyFileList',
    label: '附件',
    component: 'Upload',
    slot: 'uploadAttachmentsSlot',
    colProps: { span: 24 },
    itemProps: {
      wrapperCol: { span: 24, sm: { span: 21 } },
    },
    // 可以通过showTable来展示已上传文件列表
    helpMessage: '请上传附件',
  },
];

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
