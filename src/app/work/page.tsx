'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard, Card, CardHeader, Badge, LevelBadge, PlatformBadge } from '@/components/ui';
import { getCurrentWorker, getAvailableJobsForWorker, getJobClaimsByWorkerId, getTeamsByWorkerId } from '@/lib/storage';
import type { Worker, Job, JobClaim, Team } from '@/types';

export default function WorkerDashboard() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myClaims, setMyClaims] = useState<JobClaim[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);

  useEffect(() => {
    const currentWorker = getCurrentWorker();
    if (currentWorker) {
      setWorker(currentWorker);
      setAvailableJobs(getAvailableJobsForWorker(currentWorker.id));
      setMyClaims(getJobClaimsByWorkerId(currentWorker.id));
      setMyTeams(getTeamsByWorkerId(currentWorker.id));
    }
  }, []);

  if (!worker) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  const activeClaims = myClaims.filter((c) => c.status === 'claimed');
  const pendingReview = myClaims.filter((c) => c.status === 'submitted');
  const totalBalance = worker.pendingBalance + worker.availableBalance;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary-light rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">สวัสดี, {worker.displayName} 👋</h1>
            <p className="text-white/80 mt-1 text-sm">
              Daily Streak: 🔥 {worker.dailyStreak} วัน
            </p>
          </div>
          <div className="text-right">
            <LevelBadge level={worker.level} />
            <p className="text-sm mt-1">⭐ {worker.rating}</p>
          </div>
        </div>
        
        {/* Monthly Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>เป้าเดือนนี้</span>
            <span>{worker.monthlyJobsCompleted}/{worker.monthlyJobsTarget} งาน</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-brand-secondary h-2 rounded-full transition-all"
              style={{ width: `${Math.min((worker.monthlyJobsCompleted / worker.monthlyJobsTarget) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="ยอดเงินสะสม"
          value={`฿${totalBalance.toFixed(2)}`}
          subtitle={`ถอนได้ ฿${worker.availableBalance.toFixed(2)}`}
          icon="💰"
          variant="primary"
        />
        <StatsCard
          title="งานที่รับ"
          value={activeClaims.length}
          subtitle="กำลังทำอยู่"
          icon="📋"
          variant="info"
        />
        <StatsCard
          title="รอตรวจสอบ"
          value={pendingReview.length}
          subtitle="รอแม่ทีมอนุมัติ"
          icon="⏳"
          variant="warning"
        />
        <StatsCard
          title="ทีมของฉัน"
          value={myTeams.length}
          subtitle="ทีมที่เข้าร่วม"
          icon="👥"
          variant="success"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Link href="/work/teams/search" className="btn-secondary whitespace-nowrap">
          🔍 ค้นหาทีม
        </Link>
        <Link href="/work/withdraw" className="btn-outline whitespace-nowrap">
          💸 ถอนเงิน
        </Link>
        <Link href="/work/accounts" className="btn-ghost whitespace-nowrap">
          📱 จัดการบัญชี
        </Link>
      </div>

      {/* Available Jobs */}
      <Card>
        <CardHeader
          title="งานที่เปิดรับ"
          subtitle={`จากทีมของคุณ (${availableJobs.length} งาน)`}
          action={
            <Link href="/work/my-jobs" className="text-sm text-brand-primary hover:underline">
              ดูทั้งหมด →
            </Link>
          }
        />

        {availableJobs.length === 0 ? (
          <div className="text-center py-8 text-brand-text-light">
            <span className="text-4xl block mb-2">📭</span>
            <p>ยังไม่มีงานในตอนนี้</p>
            <p className="text-sm mt-1">ลองค้นหาทีมใหม่เพื่อรับงานเพิ่มเติม</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableJobs.slice(0, 5).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </Card>

      {/* My Teams */}
      <Card>
        <CardHeader
          title="ทีมของฉัน"
          action={
            <Link href="/work/teams" className="text-sm text-brand-primary hover:underline">
              จัดการทีม →
            </Link>
          }
        />

        {myTeams.length === 0 ? (
          <div className="text-center py-8 text-brand-text-light">
            <span className="text-4xl block mb-2">👥</span>
            <p>คุณยังไม่ได้เข้าร่วมทีมใดๆ</p>
            <Link href="/work/teams/search" className="btn-primary mt-4 inline-block">
              ค้นหาทีม
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myTeams.map((team) => (
              <Link
                key={team.id}
                href={`/work/teams/${team.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border border-brand-border hover:border-brand-primary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-text-dark truncate">{team.name}</p>
                  <p className="text-xs text-brand-text-light">
                    {team.memberCount} สมาชิก • {team.activeJobCount} งานเปิดรับ
                  </p>
                </div>
                <span className="text-brand-text-light">›</span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// Job Card Component
function JobCard({ job }: { job: Job }) {
  const remaining = job.targetQuantity - job.claimedQuantity;
  const earnings = remaining * job.pricePerUnit;

  const actionIcon = {
    like: '👍',
    comment: '💬',
    follow: '👤',
    share: '🔄',
    view: '👁️',
  };

  return (
    <Link
      href={`/work/jobs/${job.id}`}
      className="block p-4 rounded-lg border border-brand-border hover:border-brand-primary/50 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <PlatformBadge platform={job.platform} />
            <span className="text-brand-text-light text-sm">
              {actionIcon[job.type]} {job.type}
            </span>
          </div>
          <h3 className="font-medium text-brand-text-dark truncate">
            {job.title || job.targetUrl}
          </h3>
          {job.minLevelRequired && (
            <p className="text-xs text-brand-text-light mt-1">
              ต้องการ Level: <LevelBadge level={job.minLevelRequired} />
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-brand-primary">฿{job.pricePerUnit}</p>
          <p className="text-xs text-brand-text-light">ต่อหน่วย</p>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-brand-text-light">
          เหลือ {remaining.toLocaleString()} / {job.targetQuantity.toLocaleString()}
        </span>
        <Badge variant="success">
          รับได้ถึง ฿{earnings.toFixed(2)}
        </Badge>
      </div>
    </Link>
  );
}

