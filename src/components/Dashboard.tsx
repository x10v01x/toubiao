import React from 'react';
import { TrendingUp, FileCheck, FileX, Clock, ArrowUpRight, ArrowDownRight, Calendar, Activity, Zap, Shield, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, LineChart, Line } from 'recharts';

const data = [
  { name: '01', value: 12, active: 8 },
  { name: '02', value: 19, active: 12 },
  { name: '03', value: 15, active: 10 },
  { name: '04', value: 22, active: 15 },
  { name: '05', value: 30, active: 22 },
  { name: '06', value: 25, active: 18 },
];

const pieData = [
  { name: '中标', value: 45, color: '#10b981' },
  { name: '未中标', value: 30, color: '#f43f5e' },
  { name: '评审中', value: 25, color: '#f59e0b' },
];

const StatCard = ({ title, value, change, icon: Icon, trend, subValue }: any) => (
  <div className="bg-white p-6 border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:border-slate-900">
    <div className="absolute top-0 left-0 w-1 h-full bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
        <Icon size={12} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
        {title}
      </div>
      <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend === 'up' ? '+' : '-'}{change}
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <div className="text-4xl font-bold text-slate-900 tracking-tighter font-mono">{value}</div>
      <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">{subValue}</div>
    </div>
    <div className="mt-6 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
      <div 
        className={`h-full ${trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500'} opacity-30 transition-all duration-1000`} 
        style={{ width: '70%' }}
      ></div>
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 font-sans">
      <div className="flex justify-between items-end border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity size={12} className="text-emerald-500" />
            系统运行状态 / 正常
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">投标效能概览</h1>
          <p className="text-sm text-slate-500 italic font-serif">实时分析企业投标数据，量化评估立项评审与标书编写效率</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">最后同步时间</div>
            <div className="text-xs font-mono font-bold text-slate-900">2024-03-30 10:23:28</div>
          </div>
          <button className="px-6 py-3 bg-slate-900 text-white text-[10px] font-mono font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl active:scale-95">
            <Zap size={14} />
            生成效能报告
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatCard title="总投标数" value="128" change="12%" icon={TrendingUp} trend="up" subValue="项目" />
        <StatCard title="综合胜率" value="42.8%" change="5.2%" icon={FileCheck} trend="up" subValue="平均" />
        <StatCard title="活跃评审" value="14" change="2" icon={Clock} trend="up" subValue="待处理" />
        <StatCard title="风险预警" value="03" change="1" icon={Shield} trend="down" subValue="紧急" />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 bg-white p-10 border border-slate-200 shadow-sm group hover:border-slate-900 transition-colors">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
                <BarChart3 size={14} className="text-slate-400" />
                投标趋势分析
              </h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Monthly Performance Trend</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-900"></div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">总数</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500"></div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">活跃</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold', fontFamily: 'monospace' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold', fontFamily: 'monospace' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '0px', 
                    border: '1px solid #0f172a', 
                    boxShadow: '10px 10px 0px rgba(15, 23, 42, 0.05)',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}
                />
                <Bar dataKey="value" fill="#0f172a" barSize={40} />
                <Bar dataKey="active" fill="#10b981" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-4 bg-white p-10 border border-slate-200 shadow-sm flex flex-col group hover:border-slate-900 transition-colors">
          <div className="space-y-1 mb-10">
            <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em] flex items-center gap-2">
              <PieChartIcon size={14} className="text-slate-400" />
              胜率分布
            </h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Win Distribution Matrix</p>
          </div>
          <div className="flex-1 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-5xl font-bold text-slate-900 font-mono tracking-tighter">42.8</div>
              <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-[0.2em]">胜率 %</div>
            </div>
          </div>
          <div className="mt-10 space-y-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden group hover:border-slate-900 transition-colors">
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-[10px] font-mono font-bold text-slate-900 uppercase tracking-[0.3em]">
              实时任务队列
            </h3>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Real-time Mission Queue</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-[0.2em]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            实时更新中
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { id: 'TX-902', project: '某市智慧城市基础设施建设工程（一期）', node: '标书递交截止', time: '2024-04-20 10:00', status: '紧急', priority: '高' },
            { id: 'TX-884', project: '某大型体育场馆外立面翻新及亮化工程', node: '专家评审会议', time: '2024-04-15 14:30', status: '正常', priority: '中' },
            { id: 'TX-871', project: '2024年高标准农田建设及配套设施采购项目', node: '开标结果公示', time: '2024-04-10 09:00', status: '正常', priority: '低' },
          ].map((item, i) => (
            <div key={i} className="flex items-center p-8 hover:bg-slate-50 transition-all group/item">
              <div className="w-20 text-[10px] font-mono font-bold text-slate-400 group-hover/item:text-slate-900 transition-colors">{item.id}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900 group-hover/item:text-blue-600 transition-colors tracking-tight">{item.project}</div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">{item.node}</div>
              </div>
              <div className="w-64 text-right">
                <div className="text-xs font-mono font-bold text-slate-700">{item.time}</div>
                <div className={`text-[10px] font-mono font-bold mt-1 uppercase tracking-widest ${item.status === '紧急' ? 'text-rose-600' : 'text-blue-600'}`}>
                  {item.status === '紧急' ? '剩余 21 天' : '剩余 16 天'}
                </div>
              </div>
              <div className="ml-12">
                <span className={`px-3 py-1 text-[9px] font-mono font-bold border uppercase tracking-[0.2em] ${
                  item.priority === '高' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                  item.priority === '中' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                  'bg-slate-50 text-slate-700 border-slate-100'
                }`}>
                  优先级: {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
