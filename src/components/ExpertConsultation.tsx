import React, { useState } from 'react';
import { Consultation, ForumPost, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Users,
  Stethoscope,
  Send,
  ThumbsUp,
  CheckCircle,
  Plus,
  HelpCircle,
  CornerDownRight,
  ShieldCheck,
} from 'lucide-react';

interface ExpertConsultationProps {
  consultations: Consultation[];
  forumPosts: ForumPost[];
  onAddConsultation: (data: Partial<Consultation>) => Promise<void>;
  onReplyConsultation: (id: string, reply: { senderName: string; senderRole: UserRole; text: string; prescription?: string }) => Promise<void>;
  onAddForumPost: (post: Partial<ForumPost>) => Promise<void>;
  onReplyForumPost: (id: string, reply: { authorName: string; authorRole: UserRole; text: string }) => Promise<void>;
  onUpvoteForumPost: (id: string) => Promise<void>;
}

export const ExpertConsultation: React.FC<ExpertConsultationProps> = ({
  consultations,
  forumPosts,
  onAddConsultation,
  onReplyConsultation,
  onAddForumPost,
  onReplyForumPost,
  onUpvoteForumPost,
}) => {
  const { t } = useLanguage();
  const { user, role } = useAuth();

  const [activeSection, setActiveSection] = useState<'consult' | 'forum'>('consult');

  // Consultation state
  const [selectedConsultId, setSelectedConsultId] = useState<string>(consultations[0]?.id || '');
  const [showNewConsultModal, setShowNewConsultModal] = useState(false);
  const [consultReplyText, setConsultReplyText] = useState('');
  const [expertPrescriptionText, setExpertPrescriptionText] = useState('');
  const [newConsultForm, setNewConsultForm] = useState({
    cropName: 'Durum Wheat',
    subject: '',
    symptoms: '',
  });

  // Forum state
  const [forumCategory, setForumCategory] = useState<string>('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [newPostForm, setNewPostForm] = useState({
    title: '',
    content: '',
    category: 'Organic Farming' as ForumPost['category'],
  });

  const activeConsultation = consultations.find((c) => c.id === selectedConsultId) || consultations[0];

  const handleSendConsultReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultReplyText.trim() && !expertPrescriptionText.trim()) return;
    if (!activeConsultation) return;

    await onReplyConsultation(activeConsultation.id, {
      senderName: user?.name || (role === 'expert' ? 'Dr. Sunita Deshmukh' : 'Farmer Ramesh'),
      senderRole: role,
      text: consultReplyText || 'Prescription provided.',
      prescription: role === 'expert' ? expertPrescriptionText : undefined,
    });
    setConsultReplyText('');
    setExpertPrescriptionText('');
  };

  const handleCreateConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddConsultation({
      farmerId: user?.id || 'usr-farmer-1',
      farmerName: user?.name || 'Ramesh Patel',
      cropName: newConsultForm.cropName,
      subject: newConsultForm.subject,
      symptoms: newConsultForm.symptoms,
    });
    setShowNewConsultModal(false);
    setNewConsultForm({ cropName: 'Durum Wheat', subject: '', symptoms: '' });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddForumPost({
      authorId: user?.id || 'usr-farmer-1',
      authorName: user?.name || 'Farmer Ramesh',
      authorRole: role,
      title: newPostForm.title,
      content: newPostForm.content,
      category: newPostForm.category,
    });
    setShowNewPostModal(false);
    setNewPostForm({ title: '', content: '', category: 'Organic Farming' });
  };

  const handleSendPostReply = async (postId: string) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    await onReplyForumPost(postId, {
      authorName: user?.name || 'Community Member',
      authorRole: role,
      text: text.trim(),
    });

    setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const filteredForumPosts = forumPosts.filter(
    (p) => forumCategory === 'all' || p.category === forumCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Section Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Expert Advisory & Community Knowledge Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct diagnosis with certified agricultural scientists and peer-to-peer farmer solutions
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveSection('consult')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSection === 'consult' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-700" />
            <span>Agronomist Consultations</span>
          </button>
          <button
            onClick={() => setActiveSection('forum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSection === 'forum' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>Community Forum</span>
          </button>
        </div>
      </div>

      {activeSection === 'consult' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Consultation Tickets */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Consultation Cases</h2>
              <button
                onClick={() => setShowNewConsultModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>New Query</span>
              </button>
            </div>

            <div className="space-y-2">
              {consultations.map((c) => {
                const isSelected = activeConsultation?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConsultId(c.id)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-200'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-slate-900 truncate">{c.cropName}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          c.status === 'Prescription Provided'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="font-medium text-slate-700 line-clamp-1">{c.subject}</p>
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mt-1 font-mono tabular-nums">
                      <span>{c.farmerName}</span>
                      <span>{c.createdAt.slice(0, 10)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Consultation Thread */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 lg:col-span-2 flex flex-col justify-between">
            {activeConsultation ? (
              <div className="space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">{activeConsultation.cropName}</span>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      {activeConsultation.createdAt.slice(0, 10)}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{activeConsultation.subject}</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    <strong className="text-slate-800">Reported Symptoms:</strong> {activeConsultation.symptoms}
                  </p>
                </div>

                {/* Prescription Box if provided */}
                {activeConsultation.expertPrescription && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 mb-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Certified Agronomist Prescription ({activeConsultation.expertName})</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {activeConsultation.expertPrescription}
                    </p>
                  </div>
                )}

                {/* Message Log */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Discussion Messages
                  </span>
                  {activeConsultation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl text-xs max-w-xl ${
                        msg.senderRole === 'expert'
                          ? 'bg-blue-50 border border-blue-100 ml-auto'
                          : 'bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900">
                          {msg.senderName}{' '}
                          <span className="font-normal text-slate-500">
                            ({msg.senderRole === 'expert' ? 'Agronomist' : 'Farmer'})
                          </span>
                        </span>
                        <span className="text-slate-400 font-mono tabular-nums">{msg.createdAt.slice(11, 16)}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendConsultReply} className="pt-4 border-t border-slate-100 space-y-3">
                  {role === 'expert' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Official Scientific Prescription (Expert Only)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Write official chemical / organic remedy with exact dosage..."
                        value={expertPrescriptionText}
                        onChange={(e) => setExpertPrescriptionText(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={role === 'expert' ? 'Add expert note or reply...' : 'Type follow-up question...'}
                      value={consultReplyText}
                      onChange={(e) => setConsultReplyText(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select or open a consultation case.</p>
            )}
          </div>
        </div>
      ) : (
        /* Community Forum View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {['all', 'Organic Farming', 'Soil Management', 'Crop Diseases', 'Govt Subsidies'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setForumCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    forumCategory === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Topics' : cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewPostModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ask Community</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredForumPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{post.title}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Posted by <strong>{post.authorName}</strong> ({post.authorRole}) ·{' '}
                      <span className="font-mono tabular-nums">{post.createdAt.slice(0, 10)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpvoteForumPost(post.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors shrink-0"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-mono tabular-nums font-bold">{post.upvotes}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{post.content}</p>

                {/* Replies Thread */}
                {post.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-slate-200 space-y-2 pt-1">
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-0.5">
                          <span>{reply.authorName}</span>
                          {reply.authorRole === 'expert' && (
                            <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-normal flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>Verified Expert</span>
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="Contribute your experience or reply..."
                    value={replyInputs[post.id] || ''}
                    onChange={(e) =>
                      setReplyInputs({ ...replyInputs, [post.id]: e.target.value })
                    }
                    className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                  <button
                    onClick={() => handleSendPostReply(post.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Consultation Modal */}
      {showNewConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Consult Agronomist</h2>
            <p className="text-xs text-slate-500 mb-4">
              Describe crop symptoms to receive a certified scientific remedy.
            </p>

            <form onSubmit={handleCreateConsultation} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Crop Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Durum Wheat, Soybean, Tomato"
                  value={newConsultForm.cropName}
                  onChange={(e) => setNewConsultForm({ ...newConsultForm, cropName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Subject / Issue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yellow leaf spots with white powdery residue"
                  value={newConsultForm.subject}
                  onChange={(e) => setNewConsultForm({ ...newConsultForm, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Detailed Symptoms & History</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Include irrigation cycle, fertilizer applied, weather conditions..."
                  value={newConsultForm.symptoms}
                  onChange={(e) => setNewConsultForm({ ...newConsultForm, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewConsultModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors"
                >
                  Submit Query
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Forum Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">New Community Discussion</h2>
            <p className="text-xs text-slate-500 mb-4">
              Share a question or farming experience with the agricultural community.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Topic Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best organic spray schedule for Chickpea Pod Borer?"
                  value={newPostForm.title}
                  onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={newPostForm.category}
                  onChange={(e) => setNewPostForm({ ...newPostForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                >
                  <option value="Organic Farming">Organic Farming</option>
                  <option value="Soil Management">Soil Management</option>
                  <option value="Crop Diseases">Crop Diseases</option>
                  <option value="Irrigation Hacks">Irrigation Hacks</option>
                  <option value="Govt Subsidies">Govt Subsidies</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Content / Question</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain what worked, your acreage, or question..."
                  value={newPostForm.content}
                  onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors"
                >
                  Post to Forum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
