// ===== LocalStorage Utils for MeeLike Seller Prototype =====

import type {
  Seller,
  Worker,
  Team,
  TeamMember,
  StoreService,
  Order,
  Job,
  JobClaim,
  WorkerAccount,
  Payout,
} from '@/types';

import {
  mockSeller,
  mockWorker,
  mockWorkers,
  mockTeam,
  mockTeams,
  mockTeamMembers,
  mockServices,
  mockOrders,
  mockOrderItems,
  mockJobs,
  mockJobClaims,
  mockWorkerAccounts,
  mockPayouts,
} from '@/lib/mock-data';

// ===== STORAGE KEYS =====
const KEYS = {
  // User session
  CURRENT_USER_ID: 'meelike_current_user_id',
  CURRENT_USER_ROLE: 'meelike_current_user_role',
  
  // Data
  SELLERS: 'meelike_sellers',
  WORKERS: 'meelike_workers',
  TEAMS: 'meelike_teams',
  TEAM_MEMBERS: 'meelike_team_members',
  SERVICES: 'meelike_services',
  ORDERS: 'meelike_orders',
  ORDER_ITEMS: 'meelike_order_items',
  JOBS: 'meelike_jobs',
  JOB_CLAIMS: 'meelike_job_claims',
  WORKER_ACCOUNTS: 'meelike_worker_accounts',
  PAYOUTS: 'meelike_payouts',
  
  // Initialized flag
  INITIALIZED: 'meelike_initialized',
};

// ===== HELPER FUNCTIONS =====
function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ===== INITIALIZATION =====
export function initializeStorage(): void {
  if (typeof window === 'undefined') return;
  
  const initialized = localStorage.getItem(KEYS.INITIALIZED);
  if (initialized) return;
  
  // Initialize with mock data
  setItem(KEYS.SELLERS, [mockSeller]);
  setItem(KEYS.WORKERS, mockWorkers);
  setItem(KEYS.TEAMS, mockTeams);
  setItem(KEYS.TEAM_MEMBERS, mockTeamMembers);
  setItem(KEYS.SERVICES, mockServices);
  setItem(KEYS.ORDERS, mockOrders);
  setItem(KEYS.ORDER_ITEMS, mockOrderItems);
  setItem(KEYS.JOBS, mockJobs);
  setItem(KEYS.JOB_CLAIMS, mockJobClaims);
  setItem(KEYS.WORKER_ACCOUNTS, mockWorkerAccounts);
  setItem(KEYS.PAYOUTS, mockPayouts);
  
  // Set default user as seller
  setItem(KEYS.CURRENT_USER_ID, mockSeller.id);
  setItem(KEYS.CURRENT_USER_ROLE, 'seller');
  
  localStorage.setItem(KEYS.INITIALIZED, 'true');
}

export function resetStorage(): void {
  if (typeof window === 'undefined') return;
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
}

// ===== SESSION =====
export function getCurrentUserId(): string | null {
  return getItem<string>(KEYS.CURRENT_USER_ID);
}

export function getCurrentUserRole(): 'seller' | 'worker' | null {
  return getItem<'seller' | 'worker'>(KEYS.CURRENT_USER_ROLE);
}

export function setCurrentUser(userId: string, role: 'seller' | 'worker'): void {
  setItem(KEYS.CURRENT_USER_ID, userId);
  setItem(KEYS.CURRENT_USER_ROLE, role);
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.CURRENT_USER_ID);
  localStorage.removeItem(KEYS.CURRENT_USER_ROLE);
}

// ===== SELLERS =====
export function getSellers(): Seller[] {
  return getItem<Seller[]>(KEYS.SELLERS) || [];
}

export function getSellerById(id: string): Seller | undefined {
  return getSellers().find(s => s.id === id);
}

export function getCurrentSeller(): Seller | undefined {
  const id = getCurrentUserId();
  if (!id) return undefined;
  return getSellerById(id);
}

export function updateSeller(seller: Seller): void {
  const sellers = getSellers();
  const index = sellers.findIndex(s => s.id === seller.id);
  if (index !== -1) {
    sellers[index] = seller;
    setItem(KEYS.SELLERS, sellers);
  }
}

// ===== WORKERS =====
export function getWorkers(): Worker[] {
  return getItem<Worker[]>(KEYS.WORKERS) || [];
}

export function getWorkerById(id: string): Worker | undefined {
  return getWorkers().find(w => w.id === id);
}

export function getCurrentWorker(): Worker | undefined {
  const id = getCurrentUserId();
  if (!id) return undefined;
  return getWorkerById(id);
}

export function updateWorker(worker: Worker): void {
  const workers = getWorkers();
  const index = workers.findIndex(w => w.id === worker.id);
  if (index !== -1) {
    workers[index] = worker;
    setItem(KEYS.WORKERS, workers);
  }
}

// ===== TEAMS =====
export function getTeams(): Team[] {
  return getItem<Team[]>(KEYS.TEAMS) || [];
}

export function getTeamById(id: string): Team | undefined {
  return getTeams().find(t => t.id === id);
}

export function getTeamsBySellerId(sellerId: string): Team[] {
  return getTeams().filter(t => t.sellerId === sellerId);
}

export function getTeamsByWorkerId(workerId: string): Team[] {
  const worker = getWorkerById(workerId);
  if (!worker) return [];
  return getTeams().filter(t => worker.teamIds.includes(t.id));
}

export function getPublicRecruitingTeams(): Team[] {
  return getTeams().filter(t => t.isPublic && t.isRecruiting && t.isActive);
}

export function updateTeam(team: Team): void {
  const teams = getTeams();
  const index = teams.findIndex(t => t.id === team.id);
  if (index !== -1) {
    teams[index] = team;
    setItem(KEYS.TEAMS, teams);
  }
}

export function addTeam(team: Team): void {
  const teams = getTeams();
  teams.push(team);
  setItem(KEYS.TEAMS, teams);
}

// ===== TEAM MEMBERS =====
export function getTeamMembers(): TeamMember[] {
  return getItem<TeamMember[]>(KEYS.TEAM_MEMBERS) || [];
}

export function getTeamMembersByTeamId(teamId: string): TeamMember[] {
  return getTeamMembers().filter(tm => tm.teamId === teamId);
}

export function getTeamMembersByWorkerId(workerId: string): TeamMember[] {
  return getTeamMembers().filter(tm => tm.workerId === workerId);
}

export function addTeamMember(member: TeamMember): void {
  const members = getTeamMembers();
  members.push(member);
  setItem(KEYS.TEAM_MEMBERS, members);
}

export function updateTeamMember(member: TeamMember): void {
  const members = getTeamMembers();
  const index = members.findIndex(m => m.id === member.id);
  if (index !== -1) {
    members[index] = member;
    setItem(KEYS.TEAM_MEMBERS, members);
  }
}

// ===== SERVICES =====
export function getServices(): StoreService[] {
  return getItem<StoreService[]>(KEYS.SERVICES) || [];
}

export function getServicesBySellerId(sellerId: string): StoreService[] {
  return getServices().filter(s => s.sellerId === sellerId);
}

export function getServiceById(id: string): StoreService | undefined {
  return getServices().find(s => s.id === id);
}

export function addService(service: StoreService): void {
  const services = getServices();
  services.push(service);
  setItem(KEYS.SERVICES, services);
}

export function updateService(service: StoreService): void {
  const services = getServices();
  const index = services.findIndex(s => s.id === service.id);
  if (index !== -1) {
    services[index] = service;
    setItem(KEYS.SERVICES, services);
  }
}

export function deleteService(id: string): void {
  const services = getServices().filter(s => s.id !== id);
  setItem(KEYS.SERVICES, services);
}

// ===== ORDERS =====
export function getOrders(): Order[] {
  return getItem<Order[]>(KEYS.ORDERS) || [];
}

export function getOrdersBySellerId(sellerId: string): Order[] {
  return getOrders().filter(o => o.sellerId === sellerId);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find(o => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getOrders().find(o => o.orderNumber === orderNumber);
}

export function addOrder(order: Order): void {
  const orders = getOrders();
  orders.push(order);
  setItem(KEYS.ORDERS, orders);
}

export function updateOrder(order: Order): void {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === order.id);
  if (index !== -1) {
    orders[index] = order;
    setItem(KEYS.ORDERS, orders);
  }
}

// ===== JOBS =====
export function getJobs(): Job[] {
  return getItem<Job[]>(KEYS.JOBS) || [];
}

export function getJobsBySellerId(sellerId: string): Job[] {
  return getJobs().filter(j => j.sellerId === sellerId);
}

export function getJobsByTeamId(teamId: string): Job[] {
  return getJobs().filter(j => j.teamId === teamId);
}

export function getAvailableJobsForWorker(workerId: string): Job[] {
  const worker = getWorkerById(workerId);
  if (!worker) return [];
  
  return getJobs().filter(j => {
    // Must be in worker's team
    if (!worker.teamIds.includes(j.teamId)) return false;
    
    // Must be open or in progress with remaining quantity
    if (j.status !== 'open' && j.status !== 'in_progress') return false;
    
    // Check remaining quantity
    if (j.claimedQuantity >= j.targetQuantity) return false;
    
    // Check level requirement
    if (j.minLevelRequired) {
      const levels = ['bronze', 'silver', 'gold', 'platinum', 'vip'];
      if (levels.indexOf(worker.level) < levels.indexOf(j.minLevelRequired)) {
        return false;
      }
    }
    
    return true;
  });
}

export function getJobById(id: string): Job | undefined {
  return getJobs().find(j => j.id === id);
}

export function addJob(job: Job): void {
  const jobs = getJobs();
  jobs.push(job);
  setItem(KEYS.JOBS, jobs);
}

export function updateJob(job: Job): void {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === job.id);
  if (index !== -1) {
    jobs[index] = job;
    setItem(KEYS.JOBS, jobs);
  }
}

// ===== JOB CLAIMS =====
export function getJobClaims(): JobClaim[] {
  return getItem<JobClaim[]>(KEYS.JOB_CLAIMS) || [];
}

export function getJobClaimsByJobId(jobId: string): JobClaim[] {
  return getJobClaims().filter(c => c.jobId === jobId);
}

export function getJobClaimsByWorkerId(workerId: string): JobClaim[] {
  return getJobClaims().filter(c => c.workerId === workerId);
}

export function getPendingReviewClaims(sellerId: string): JobClaim[] {
  const sellerJobs = getJobsBySellerId(sellerId);
  const jobIds = sellerJobs.map(j => j.id);
  return getJobClaims().filter(c => 
    jobIds.includes(c.jobId) && c.status === 'submitted'
  );
}

export function addJobClaim(claim: JobClaim): void {
  const claims = getJobClaims();
  claims.push(claim);
  setItem(KEYS.JOB_CLAIMS, claims);
}

export function updateJobClaim(claim: JobClaim): void {
  const claims = getJobClaims();
  const index = claims.findIndex(c => c.id === claim.id);
  if (index !== -1) {
    claims[index] = claim;
    setItem(KEYS.JOB_CLAIMS, claims);
  }
}

// ===== WORKER ACCOUNTS =====
export function getWorkerAccounts(): WorkerAccount[] {
  return getItem<WorkerAccount[]>(KEYS.WORKER_ACCOUNTS) || [];
}

export function getWorkerAccountsByWorkerId(workerId: string): WorkerAccount[] {
  return getWorkerAccounts().filter(wa => wa.workerId === workerId);
}

export function addWorkerAccount(account: WorkerAccount): void {
  const accounts = getWorkerAccounts();
  accounts.push(account);
  setItem(KEYS.WORKER_ACCOUNTS, accounts);
}

export function updateWorkerAccount(account: WorkerAccount): void {
  const accounts = getWorkerAccounts();
  const index = accounts.findIndex(a => a.id === account.id);
  if (index !== -1) {
    accounts[index] = account;
    setItem(KEYS.WORKER_ACCOUNTS, accounts);
  }
}

// ===== PAYOUTS =====
export function getPayouts(): Payout[] {
  return getItem<Payout[]>(KEYS.PAYOUTS) || [];
}

export function getPayoutsByWorkerId(workerId: string): Payout[] {
  return getPayouts().filter(p => p.workerId === workerId);
}

export function addPayout(payout: Payout): void {
  const payouts = getPayouts();
  payouts.push(payout);
  setItem(KEYS.PAYOUTS, payouts);
}

export function updatePayout(payout: Payout): void {
  const payouts = getPayouts();
  const index = payouts.findIndex(p => p.id === payout.id);
  if (index !== -1) {
    payouts[index] = payout;
    setItem(KEYS.PAYOUTS, payouts);
  }
}

// ===== ID GENERATORS =====
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const orders = getOrders();
  const count = orders.length + 1;
  return `ORD-${year}-${count.toString().padStart(3, '0')}`;
}

