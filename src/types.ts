export type ProjectStatus = '待评审' | '评审中' | '已评审' | '标书编写中' | '已完成' | '已放弃';

export interface Project {
  id: string;
  title: string;
  agency: string;
  location: string;
  budget: string;
  deadline: string;
  status: ProjectStatus;
  publishDate: string;
  source: string;
  hasReview: boolean;
  hasDraft: boolean;
}

export interface Attachment {
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'other';
  size: string;
  url: string;
}

export interface MatchItem {
  name: string;
  requirement: string;
  status: '命中' | '部分满足' | '缺失' | '可调配';
  evidence?: string;
}

export interface ReviewSummary {
  overall: string;
  strengths: string[];
  risks: string[];
  suggestions: string[];
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PJ001',
    title: '2024年某市智慧城市基础设施建设工程（一期）',
    agency: '某市政务服务和数据管理局',
    location: '广东省某市',
    budget: '4,500.00 万元',
    deadline: '2024-04-20',
    status: '已评审',
    publishDate: '2024-03-25',
    source: '中国政府采购网',
    hasReview: true,
    hasDraft: false,
  },
  {
    id: 'PJ002',
    title: '某大型体育场馆外立面翻新及亮化工程',
    agency: '某市文化广电旅游体育局',
    location: '江苏省某市',
    budget: '1,200.00 万元',
    deadline: '2024-04-15',
    status: '标书编写中',
    publishDate: '2024-03-20',
    source: '省公共资源交易中心',
    hasReview: true,
    hasDraft: true,
  },
  {
    id: 'PJ003',
    title: '2024年高标准农田建设及配套设施采购项目',
    agency: '某县农业农村局',
    location: '四川省某县',
    budget: '850.00 万元',
    deadline: '2024-04-10',
    status: '待评审',
    publishDate: '2024-03-28',
    source: '中国政府采购网',
    hasReview: false,
    hasDraft: false,
  },
];
