import React from 'react';
import { ChevronRight } from 'lucide-react';

interface KnowledgeMatchProps {
  onBack: () => void;
  onNext: (view: string) => void;
}

export const KnowledgeMatch = ({ onBack, onNext }: KnowledgeMatchProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => onNext('list')} className="hover:text-slate-900 transition-colors">项目列表</button>
        <ChevronRight size={14} />
        <button onClick={onBack} className="hover:text-slate-900 transition-colors">AI 评审结果</button>
        <ChevronRight size={14} />
        <span className="text-slate-900 font-medium">企业知识匹配详情</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">资质与人员匹配矩阵</h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
              <span className="text-xs text-slate-500">完全命中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-sm"></div>
              <span className="text-xs text-slate-500">部分满足</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-500 rounded-sm"></div>
              <span className="text-xs text-slate-500">缺失项</span>
            </div>
          </div>
        </div>
        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">类别</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/3">招标要求</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">匹配状态</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">匹配详情 / 证据支撑</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { cat: '企业资质', req: '电子与智能化工程专业承包一级', status: '命中', detail: '证书编号：D244012345，有效期至2026年', color: 'text-emerald-600 bg-emerald-50' },
                { cat: '企业资质', req: '信息系统建设和服务能力等级CS4', status: '命中', detail: '证书编号：CS4-2022-001，已通过年审', color: 'text-emerald-600 bg-emerald-50' },
                { cat: '人员证书', req: '高级信息系统项目管理师 (3名)', status: '部分满足', detail: '目前在册：张三、李四。缺口：1名。建议从华东分公司调配。', color: 'text-amber-600 bg-amber-50' },
                { cat: '人员证书', req: '注册电气工程师 (1名)', status: '命中', detail: '匹配人员：王五，证书状态：有效', color: 'text-emerald-600 bg-emerald-50' },
                { cat: '类似业绩', req: '近三年4000万以上智慧城市项目', status: '命中', detail: '命中3项：XX市智慧交通(4.5k万)、YY区数字政府(5.2k万)、ZZ市大脑(6.1k万)', color: 'text-emerald-600 bg-emerald-50' },
                { cat: '财务能力', req: '项目所在地纳税信用A级', status: '命中', detail: '2021-2023连续三年A级，税务局官方证明已获取', color: 'text-emerald-600 bg-emerald-50' },
                { cat: '设备要求', req: '具备专用检测设备 (5套)', status: '可调配', detail: '自有3套，可通过租赁协议补充2套。', color: 'text-blue-600 bg-blue-50' },
              ].map((item, i) => (
                <tr key={i} className="text-sm hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.cat}</td>
                  <td className="px-6 py-4 text-slate-600 leading-relaxed">{item.req}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter border ${item.color} border-current opacity-80`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 italic leading-relaxed">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
