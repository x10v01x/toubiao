import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Bot, ChevronDown, Loader2, Zap, Activity, ShieldCheck, Terminal, Trash2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Project } from '../types';

interface AIAssistantProps {
  selectedProject: Project | null;
  currentView: string;
}

export const AIAssistant = ({ selectedProject, currentView }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: '1', role: 'bot', text: '系统已就绪。投标 AI 助手已上线。我可以为您分析招标文件、匹配公司资质或协助起草技术标段。今天有什么可以帮您的？' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      { id: '1', role: 'bot', text: '系统已就绪。投标 AI 助手已上线。我可以为您分析招标文件、匹配公司资质或协助起草技术标段。今天有什么可以帮您的？' },
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user', text: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const context = selectedProject 
        ? `当前项目: "${selectedProject.title}", 招标单位: "${selectedProject.agency}", 预算: "${selectedProject.budget}", 地点: "${selectedProject.location}".`
        : "未选择特定项目。";
      
      const viewContext = `当前用户正在查看的页面: ${currentView}。`;

      const prompt = `你是一个专业的投标助手 AI。
      ${context}
      ${viewContext}
      
      用户查询: ${messageText}
      
      请根据上下文提供专业、准确且具战略性的建议。如果用户询问项目分析、资质匹配或标书起草，请提供具体且可操作的建议。
      保持回答简洁专业。使用中文回答。`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const botMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        text: response.text || "错误：无法处理请求。"
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg = { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        text: "严重错误：连接 AI 核心失败。请重试。" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-none border border-slate-700 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-all z-50 group"
      >
        <div className="relative">
          <Terminal size={24} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 animate-pulse"></span>
        </div>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            className="fixed bottom-24 right-8 w-[420px] h-[600px] bg-[#151619] border border-slate-800 shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header - Hardware Style */}
            <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Zap size={20} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.3em]">神经核心 v4.0</div>
                  <div className="text-sm font-bold text-white tracking-tight uppercase">投标 AI 助手</div>
                </div>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <button 
                  onClick={clearChat} 
                  className="p-2 hover:bg-slate-800 text-slate-500 hover:text-rose-400 transition-all" 
                  title="清空对话"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex flex-col items-end">
                  <div className="text-[8px] font-mono font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <Activity size={8} />
                    实时
                  </div>
                  <div className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-widest">加密</div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-800 text-slate-500 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>
              {/* Decorative Scanline */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-1/2 w-full animate-scanline pointer-events-none"></div>
            </div>

            {/* Status Bar */}
            <div className="px-5 py-2 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">系统就绪</span>
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                  延迟: 42ms
                </div>
              </div>
              <div className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0b0d] custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col gap-2 max-w-[90%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                        {msg.role === 'user' ? '用户输入' : 'AI 响应'}
                      </span>
                      <div className="h-px w-8 bg-slate-800"></div>
                    </div>
                    <div className={`p-4 text-xs leading-relaxed font-mono relative group/msg ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white border-r-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-slate-900/50 text-slate-300 border-l-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                    }`}>
                      {msg.role === 'bot' ? (
                        <div className="prose prose-invert prose-sm max-w-none font-mono">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                      <button 
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="absolute top-2 right-2 p-1 bg-slate-900/80 text-slate-500 hover:text-white opacity-0 group-hover/msg:opacity-100 transition-all"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex flex-col gap-2 items-start">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">处理中</span>
                      <div className="h-px w-8 bg-slate-800"></div>
                    </div>
                    <div className="flex gap-3 items-center bg-slate-900/50 p-4 border-l-2 border-emerald-500/50">
                      <Loader2 size={14} className="animate-spin text-emerald-500" />
                      <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em] animate-pulse">正在分析数据 / ANALYZING...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Command Line Style */}
            <div className="p-6 bg-slate-900 border-t border-slate-800">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-mono text-sm font-bold opacity-50 group-focus-within:opacity-100 transition-opacity">
                  {">"}
                </div>
                <input
                  type="text"
                  placeholder="输入指令..."
                  className="w-full bg-[#0a0b0d] border border-slate-800 text-white font-mono text-xs px-10 py-4 focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-slate-700"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-500 transition-colors disabled:opacity-30 active:scale-90"
                >
                  <Send size={16} />
                </button>
              </div>
              
              <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {(currentView === 'list' ? ['分析新项目', '查找历史业绩', '导入招标文件'] :
                  currentView === 'detail' ? ['提取关键要求', '分析评分权重', '检查截止日期'] :
                  currentView === 'review' ? ['如何优化优势', '如何规避风险', '生成评审报告'] :
                  currentView === 'match' ? ['查找缺失资质', '推荐替代人员', '导出匹配矩阵'] :
                  currentView === 'draft' ? ['扩写当前章节', '润色专业词汇', '检查逻辑一致性'] :
                  currentView === 'package' ? ['检查文档完整性', '合规性自检', '生成目录'] :
                  ['分析评分标准', '检查资质匹配', '生成施工方案']).map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => handleSend(tag)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-400 text-[8px] font-mono font-bold uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all disabled:opacity-30 active:scale-95"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[8px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                  <ShieldCheck size={10} />
                  安全会话
                </div>
                <div className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                  v4.0.2-STABLE
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
