'use client';

import { useState, useEffect } from 'react';
import { saveSurvey, updateCreditBalance, hasSurvey, type SurveyData } from '../utils/localStorage';

export default function WelcomeSurveyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceChannel, setSourceChannel] = useState('');
  const [sourceOther, setSourceOther] = useState('');
  const [usedCompetitor, setUsedCompetitor] = useState('no');
  const [competitorNames, setCompetitorNames] = useState<string[]>([]);
  const [competitorOther, setCompetitorOther] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [usagePurpose, setUsagePurpose] = useState(''); // New: จุดประสงค์การใช้งาน
  const [platforms, setPlatforms] = useState<string[]>([]); // New: แพลตฟอร์มที่ใช้
  const [budget, setBudget] = useState(''); // New: งบประมาณต่อเดือน
  const [priorities, setPriorities] = useState<string[]>([]); // New: สิ่งที่สำคัญที่สุด (max 2)
  const [suggestions, setSuggestions] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Don't auto-open on page load
    // Only open when triggered by promo card click
  }, []);

  // Listen for custom event to open survey from promo card
  useEffect(() => {
    const handleOpenSurvey = () => {
      if (!hasSurvey()) {
        setIsOpen(true);
      }
    };

    window.addEventListener('openSurveyModal', handleOpenSurvey);
    return () => window.removeEventListener('openSurveyModal', handleOpenSurvey);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen && !showSuccess) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Combine selected competitors with custom input
    const allCompetitors = [...competitorNames];
    if (competitorOther.trim()) {
      allCompetitors.push(competitorOther.trim());
    }

    const surveyData: SurveyData = {
      userId: 'user123', // Mock user ID
      sourceChannel: sourceChannel === 'other' ? 'other' : sourceChannel,
      sourceOther: sourceChannel === 'other' ? sourceOther : undefined,
      usedCompetitor: usedCompetitor === 'yes',
      competitorName: usedCompetitor === 'yes' ? allCompetitors.join(', ') : undefined,
      deviceType,
      usagePurpose,
      platforms: platforms.join(', '),
      budget,
      priorities: priorities.join(', '),
      suggestions: suggestions.trim() || undefined,
      creditGiven: 10,
      createdAt: new Date().toISOString()
    };

    saveSurvey(surveyData);
    updateCreditBalance(10);
    
    // Dispatch event to notify promo card that survey is completed
    window.dispatchEvent(new CustomEvent('surveyCompleted'));
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClose();
    }, 2000);
  };

  const isValid = sourceChannel && deviceType && usagePurpose && platforms.length > 0 && budget && priorities.length > 0;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-light mb-2">
            ขอบคุณ!
          </h3>
          <p className="text-brand-text-light dark:text-dark-text-light mb-4">
            ได้รับ +10 เครดิต
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-text-dark dark:text-dark-text-light">
              🎉 ยินดีต้อนรับ!
            </h2>
            <p className="text-sm text-brand-text-light dark:text-dark-text-light mt-1">
              ช่วยตอบคำถามสั้นๆ รับเครดิตฟรี 10 บาท
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-brand-text-light hover:text-brand-text-dark dark:hover:text-dark-text-light"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question 1: Source Channel */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              1. รู้จัก Meelike ได้อย่างไร? <span className="text-red-500">*</span>
            </label>
            <select
              value={sourceChannel}
              onChange={(e) => setSourceChannel(e.target.value)}
              className="w-full px-4 py-2 border border-brand-border dark:border-dark-border rounded-lg bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-light"
              required
            >
              <option value="">เลือกช่องทาง</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="google">Google</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter/X</option>
              <option value="friend">เพื่อนแนะนำ</option>
              <option value="blog">เว็บรีวิว/บล็อก</option>
              <option value="other">อื่นๆ</option>
            </select>
            {sourceChannel === 'other' && (
              <input
                type="text"
                value={sourceOther}
                onChange={(e) => setSourceOther(e.target.value)}
                placeholder="ระบุช่องทาง"
                className="w-full px-4 py-2 border border-brand-border dark:border-dark-border rounded-lg bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-light mt-2"
              />
            )}
          </div>

          {/* Question 2: Competitor */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              2. เคยใช้บริการเจ้าไหนมาก่อน? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: 'no', label: 'ไม่เคยใช้ที่ไหนมาก่อน' },
                { value: 'yes', label: 'เคยใช้เจ้าอื่น' }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="usedCompetitor"
                    value={option.value}
                    checked={usedCompetitor === option.value}
                    onChange={(e) => {
                      setUsedCompetitor(e.target.value);
                      if (e.target.value === 'no') {
                        setCompetitorNames([]);
                        setCompetitorOther('');
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-brand-text-dark dark:text-dark-text-light">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {usedCompetitor === 'yes' && (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-brand-text-light dark:text-dark-text-light">
                  เลือกได้มากกว่า 1 เจ้า
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {['ADS4U', 'ARSD', '24social', 'Punfollow'].map((competitor) => (
                    <button
                      key={competitor}
                      type="button"
                      onClick={() => {
                        if (competitorNames.includes(competitor)) {
                          // Remove if already selected
                          setCompetitorNames(competitorNames.filter(c => c !== competitor));
                        } else {
                          // Add if not selected
                          setCompetitorNames([...competitorNames, competitor]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        competitorNames.includes(competitor)
                          ? 'bg-brand-primary text-white border-brand-primary'
                          : 'bg-brand-bg dark:bg-dark-bg border-brand-border dark:border-dark-border text-brand-text-dark dark:text-dark-text-light hover:border-brand-primary'
                      }`}
                    >
                      {competitor}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm text-brand-text-light dark:text-dark-text-light mb-1">
                    หรือระบุเจ้าอื่นๆ (คั่นด้วยเครื่องหมาย , )
                  </label>
                  <input
                    type="text"
                    value={competitorOther}
                    onChange={(e) => setCompetitorOther(e.target.value)}
                    placeholder="เช่น SMM1, SMM2, SMM3"
                    className="w-full px-4 py-2 border border-brand-border dark:border-dark-border rounded-lg bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-light"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Question 3: Usage Purpose */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              3. ใช้งานเพื่ออะไรเป็นหลัก? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'personal', label: '👤 ใช้ส่วนตัว / สร้างตัวตน' },
                { value: 'business', label: '🏪 ธุรกิจส่วนตัว / ร้านค้าออนไลน์' },
                { value: 'agency', label: '💼 เอเจนซี่ / รับทำการตลาด' },
                { value: 'reseller', label: '🔄 Reseller (ซื้อไปขายต่อ)' },
                { value: 'influencer', label: '🎯 อินฟลูเอนเซอร์ / Content Creator' }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="usagePurpose"
                    value={option.value}
                    checked={usagePurpose === option.value}
                    onChange={(e) => setUsagePurpose(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-brand-text-dark dark:text-dark-text-light">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 4: Platforms */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              4. ใช้บริการกับแพลตฟอร์มไหนเป็นหลัก? <span className="text-red-500">*</span>
              <span className="text-xs text-brand-text-light ml-1">(เลือกได้หลายตัว)</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Twitter/X', 'LINE'].map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => {
                    if (platforms.includes(platform)) {
                      setPlatforms(platforms.filter(p => p !== platform));
                    } else {
                      setPlatforms([...platforms, platform]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    platforms.includes(platform)
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-bg dark:bg-dark-bg border-brand-border dark:border-dark-border text-brand-text-dark dark:text-dark-text-light hover:border-brand-primary'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Budget */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              5. งบประมาณที่คาดว่าจะใช้ต่อเดือน? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'under500', label: '💵 น้อยกว่า 500 บาท' },
                { value: '500-2000', label: '💵 500 - 2,000 บาท' },
                { value: '2000-5000', label: '💰 2,000 - 5,000 บาท' },
                { value: '5000-10000', label: '💰 5,000 - 10,000 บาท' },
                { value: 'over10000', label: '💎 มากกว่า 10,000 บาท' }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="budget"
                    value={option.value}
                    checked={budget === option.value}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-brand-text-dark dark:text-dark-text-light">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 6: Priorities */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              6. อะไรสำคัญที่สุดเมื่อเลือกใช้บริการ SMM? <span className="text-red-500">*</span>
              <span className="text-xs text-brand-text-light ml-1">(เลือกได้ 2 ข้อ)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'price', label: '💰 ราคาถูก' },
                { value: 'speed', label: '⚡ ความเร็ว' },
                { value: 'quality', label: '✨ คุณภาพ' },
                { value: 'guarantee', label: '🛡️ รับประกัน/Refill' },
                { value: 'support', label: '💬 บริการหลังการขาย' },
                { value: 'promo', label: '🎁 โปรโมชั่น' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (priorities.includes(option.value)) {
                      setPriorities(priorities.filter(p => p !== option.value));
                    } else if (priorities.length < 2) {
                      setPriorities([...priorities, option.value]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    priorities.includes(option.value)
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : priorities.length >= 2
                        ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-bg dark:bg-dark-bg border-brand-border dark:border-dark-border text-brand-text-dark dark:text-dark-text-light hover:border-brand-primary'
                  }`}
                  disabled={priorities.length >= 2 && !priorities.includes(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {priorities.length === 2 && (
              <p className="text-xs text-green-500 mt-1">✓ เลือกครบ 2 ข้อแล้ว</p>
            )}
          </div>

          {/* Question 7: Device Type */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              7. ใช้งานผ่านอุปกรณ์อะไรเป็นหลัก? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: 'mobile', label: '📱 มือถือ' },
                { value: 'desktop', label: '💻 คอมพิวเตอร์/โน้ตบุ๊ก' },
                { value: 'tablet', label: '📲 แท็บเล็ต' }
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="deviceType"
                    value={option.value}
                    checked={deviceType === option.value}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-brand-text-dark dark:text-dark-text-light">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 8: Suggestions */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark dark:text-dark-text-light mb-2">
              8. มีอะไรอยากให้เราปรับปรุงไหม? (ไม่บังคับ)
            </label>
            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="แสดงความคิดเห็นของคุณ..."
              rows={3}
              className="w-full px-4 py-2 border border-brand-border dark:border-dark-border rounded-lg bg-brand-bg dark:bg-dark-bg text-brand-text-dark dark:text-dark-text-light resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-brand-border dark:border-dark-border rounded-lg text-brand-text-dark dark:text-dark-text-light hover:bg-brand-bg dark:hover:bg-dark-bg transition-colors"
            >
              ข้ามไปก่อน
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${
                isValid
                  ? 'bg-brand-secondary hover:bg-brand-secondary-light dark:bg-dark-primary dark:hover:bg-dark-primary/80 text-brand-text-dark hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ส่งและรับ 10 เครดิต
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
