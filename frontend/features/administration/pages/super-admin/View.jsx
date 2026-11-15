'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.10e936f8.styles.js';

import inlineStyles from '@/features/administration/styles/super-admin-page.jsx.styles.js';


import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Building2, Mic, Users, Activity, Plus, Search,
  CheckCircle2, AlertTriangle, XCircle, LogOut, RefreshCw, ArrowUpRight,
  TrendingUp, Sparkles, ExternalLink, Settings, Trash2, Edit3, Lock,
  Server, Database, Wifi, Clock, ChevronRight
} from 'lucide-react';
import { T } from '@/shared/design-system/theme';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Core Data
  const [metrics, setMetrics] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [health, setHealth] = useState(null);

  // Tab State: 'orgs' | 'metering' | 'admins' | 'health'
  const [activeTab, setActiveTab] = useState('orgs');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [impersonatingOrg, setImpersonatingOrg] = useState(null);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // New Org Form
  const [newOrgForm, setNewOrgForm] = useState({
    name: '',
    slug: '',
    plan: 'pro',
    max_seats: 500,
    voice_minutes_limit: 5000,
    tokens_limit: 5000000,
    admin_name: '',
    admin_email: ''
  });

  // Verify Super Admin Authentication
  const verifySession = useCallback(async () => {
    try {
      const res = await fetch('/api/super-admin/auth/me');
      if (!res.ok) throw new Error('Unauthenticated');
      const data = await res.json();
      setCurrentUser(data.user);
      return true;
    } catch {
      router.replace('/super-admin/login');
      return false;
    }
  }, [router]);

  // Load All Metrics & Organization Data
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    setActionError('');
    setActionSuccess('');

    try {
      const res = await fetch('/api/super-admin/metrics');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.replace('/super-admin/login');
          return;
        }
        throw new Error('Failed to fetch platform metrics.');
      }

      const data = await res.json();
      setMetrics(data.metrics || null);
      setOrganizations(data.organizations || []);
      setAdmins(data.admins || []);
      setAuditLogs(data.auditLogs || []);
      setHealth(data.health || null);
    } catch (err) {
      setActionError(err.message || 'Error loading dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    verifySession().then(isValid => {
      if (isValid) loadData();
    });
  }, [verifySession, loadData]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/super-admin/auth/me', { method: 'POST' });
    } catch {}
    localStorage.removeItem('super_admin_jwt');
    localStorage.removeItem('super_admin_user');
    router.replace('/super-admin/login');
  };

  // Toggle Organization Status (Active <-> Suspended)
  const handleToggleStatus = async (org) => {
    const nextStatus = org.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch(`/api/super-admin/orgs/${org.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status.');
      setActionSuccess(`"${org.name}" status changed to ${nextStatus}.`);
      loadData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Create Organization
  const handleCreateOrg = async (e) => {
    if (e) e.preventDefault();
    setActionError('');
    try {
      const res = await fetch('/api/super-admin/orgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrgForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create organization.');

      setShowCreateModal(false);
      setActionSuccess(`Organization "${data.organization.name}" provisioned successfully!`);
      setNewOrgForm({
        name: '',
        slug: '',
        plan: 'pro',
        max_seats: 500,
        voice_minutes_limit: 5000,
        tokens_limit: 5000000,
        admin_name: '',
        admin_email: ''
      });
      loadData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Update Organization Quotas
  const handleUpdateQuotas = async (e) => {
    if (e) e.preventDefault();
    if (!editingOrg) return;
    setActionError('');
    try {
      const res = await fetch(`/api/super-admin/orgs/${editingOrg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: editingOrg.plan,
          max_seats: editingOrg.max_seats,
          voice_minutes_limit: editingOrg.voice_minutes_limit,
          tokens_limit: editingOrg.tokens_limit
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update quotas.');

      setEditingOrg(null);
      setActionSuccess(`Quotas updated for "${data.organization.name}".`);
      loadData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Impersonate Organization Admin (Opens /admin with scoped token)
  const handleImpersonate = async (org) => {
    setActionError('');
    try {
      const res = await fetch(`/api/super-admin/orgs/${org.id}/impersonate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_email: org.admin_email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Impersonation failed.');

      // Store impersonated token into localStorage & sessionStorage for /admin
      localStorage.setItem('token', data.token);
      localStorage.setItem('frappe_user', JSON.stringify({
        email: org.admin_email,
        role: 'Administrator',
        user_id: org.admin_email,
        organization_id: org.id
      }));

      // Open Org Admin view in a new tab
      window.open('/admin', '_blank');
      setActionSuccess(`Opened support session as administrator for "${org.name}".`);
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Filtered Organizations List
  const filteredOrgs = useMemo(() => {
    let list = organizations;
    if (planFilter !== 'all') {
      list = list.filter(o => o.plan === planFilter);
    }
    if (statusFilter !== 'all') {
      list = list.filter(o => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(o =>
        (o.name || '').toLowerCase().includes(q) ||
        (o.slug || '').toLowerCase().includes(q) ||
        (o.domain || '').toLowerCase().includes(q) ||
        (o.admin_email || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [organizations, planFilter, statusFilter, searchQuery]);

  if (loading) {
    return (
      <div style={inlineStyles.s0}>
        <div style={inlineStyles.s1} />
        <span>Loading Platform Super Admin Console...</span>
      </div>
    );
  }

  return (
    <div style={inlineStyles.s2}>
      {/* ── TOP NAV BAR ── */}
      <header style={inlineStyles.s3}>
        {/* Brand */}
        <div style={inlineStyles.s4}>
          <div style={inlineStyles.s5}>
            <ShieldCheck size={20} color="#fff" />
          </div>
          <div>
            <div style={inlineStyles.s6}>
              <span style={inlineStyles.s7}>Vedika 2.0</span>
              <span style={inlineStyles.s8}>
                SUPER ADMIN
              </span>
            </div>
            <div style={inlineStyles.s9}>Multi-Tenant SaaS Governance</div>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div style={inlineStyles.s10}>
          {/* Service health indicator */}
          <div style={inlineStyles.s11}>
            <div style={featureStyleFunctions.s0({health})} />
            <span>Redis: {health?.redis?.status === 'healthy' ? `${health.redis.latencyMs}ms` : 'Standby'}</span>
            <span style={inlineStyles.s12}>&middot;</span>
            <span>WS: {health?.voiceServer?.status || '5001'}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            style={featureStyleFunctions.s1({refreshing})}
            title="Refresh All Metrics"
          >
            <RefreshCw size={13} style={featureStyleFunctions.s2({refreshing})} />
            <span>Refresh</span>
          </button>

          {/* Add Org Action */}
          <button
            onClick={() => setShowCreateModal(true)}
            style={inlineStyles.s13}
          >
            <Plus size={15} />
            <span>New Organisation</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={inlineStyles.s14}
            title="Log out of Super Admin"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ── ALERTS & NOTIFICATIONS ── */}
      <div style={inlineStyles.s15}>
        {actionError && (
          <div style={inlineStyles.s16}>
            <span>{actionError}</span>
            <button onClick={() => setActionError('')} style={inlineStyles.s17}>&times;</button>
          </div>
        )}

        {actionSuccess && (
          <div style={inlineStyles.s18}>
            <span>{actionSuccess}</span>
            <button onClick={() => setActionSuccess('')} style={inlineStyles.s19}>&times;</button>
          </div>
        )}
      </div>

      {/* ── EXECUTIVE KPI METRIC RIBBON ── */}
      <div style={inlineStyles.s20}>
        <div style={inlineStyles.s21}>
          {/* Total Orgs */}
          <div style={inlineStyles.s22}>
            <div style={inlineStyles.s23}>
              <span>CLIENT ORGANISATIONS</span>
              <Building2 size={16} color="#A855F7" />
            </div>
            <div style={inlineStyles.s24}>
              {metrics?.totalOrgs || organizations.length}
            </div>
            <div style={inlineStyles.s25}>
              <span>{metrics?.activeOrgs || organizations.filter(o => o.status === 'active').length} active</span>
              {metrics?.suspendedOrgs > 0 && (
                <span style={inlineStyles.s26}>&middot; {metrics.suspendedOrgs} suspended</span>
              )}
            </div>
          </div>

          {/* Active Students */}
          <div style={inlineStyles.s27}>
            <div style={inlineStyles.s28}>
              <span>ENROLLED STUDENTS</span>
              <Users size={16} color="#3B82F6" />
            </div>
            <div style={inlineStyles.s29}>
              {(metrics?.totalStudentsEnrolled || 0).toLocaleString()}
            </div>
            <div style={inlineStyles.s30}>
              of {(metrics?.totalSeatsAllotted || 0).toLocaleString()} student seats allotted
            </div>
          </div>

          {/* Voice AI Minutes */}
          <div style={inlineStyles.s31}>
            <div style={inlineStyles.s32}>
              <span>GEMINI VOICE AI MINUTES</span>
              <Mic size={16} color="#10B981" />
            </div>
            <div style={inlineStyles.s33}>
              {(metrics?.totalVoiceMinutesUsed || 0).toLocaleString()}
            </div>
            <div style={inlineStyles.s34}>
              of {(metrics?.totalVoiceMinutesAllotted || 0).toLocaleString()} monthly limit
            </div>
          </div>

          {/* LLM Tokens */}
          <div style={inlineStyles.s35}>
            <div style={inlineStyles.s36}>
              <span>GEMINI TOKENS CONSUMED</span>
              <Activity size={16} color="#F59E0B" />
            </div>
            <div style={inlineStyles.s37}>
              {((metrics?.totalTokensUsed || 0) / 1000000).toFixed(2)}M
            </div>
            <div style={inlineStyles.s38}>
              Across all tutor queries & vivas
            </div>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div style={inlineStyles.s39}>
        <div style={inlineStyles.s40}>
          {[
            { id: 'orgs', label: 'Client Organisations', icon: Building2, count: organizations.length },
            { id: 'metering', label: 'AI & Voice Metering', icon: Mic },
            { id: 'admins', label: 'Institution Admins', icon: Users, count: admins.length },
            { id: 'health', label: 'Health & Audit Trail', icon: Server, count: auditLogs.length }
          ].map(tab => {
            const isSel = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={featureStyleFunctions.s3({isSel})}
              >
                <Icon size={16} color={isSel ? '#C084FC' : '#94A3B8'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={featureStyleFunctions.s4({isSel})}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: ORGANISATIONS MANAGER ── */}
      {activeTab === 'orgs' && (
        <div style={inlineStyles.s41}>
          {/* Controls: Search + Filter */}
          <div style={inlineStyles.s42}>
            {/* Search Input */}
            <div style={inlineStyles.s43}>
              <Search size={15} color="#64748B" />
              <input
                type="text"
                placeholder="Search organisations, slug, or admin email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={inlineStyles.s44}
              />
            </div>

            {/* Plan and Status Filters */}
            <div style={inlineStyles.s45}>
              <select
                value={planFilter}
                onChange={e => setPlanFilter(e.target.value)}
                style={inlineStyles.s46}
              >
                <option value="all">All Plans</option>
                <option value="starter">Starter</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={inlineStyles.s47}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Organisations Table */}
          <div style={inlineStyles.s48}>
            <table style={inlineStyles.s49}>
              <thead>
                <tr style={inlineStyles.s50}>
                  <th style={inlineStyles.s51}>ORGANISATION</th>
                  <th style={inlineStyles.s52}>PLAN</th>
                  <th style={inlineStyles.s53}>STUDENT SEATS</th>
                  <th style={inlineStyles.s54}>VOICE AI USAGE</th>
                  <th style={inlineStyles.s55}>PRIMARY ADMIN</th>
                  <th style={inlineStyles.s56}>STATUS</th>
                  <th style={inlineStyles.s57}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={inlineStyles.s58}>
                      No organisations match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrgs.map(org => {
                    const seatPct = Math.min(100, Math.round(((org.seats_used || 0) / (org.max_seats || 1)) * 100));
                    const voicePct = Math.min(100, Math.round(((org.voice_minutes_used || 0) / (org.voice_minutes_limit || 1)) * 100));
                    const isSuspended = org.status === 'suspended';

                    return (
                      <tr key={org.id} style={featureStyleFunctions.s5({isSuspended})}>
                        {/* Name & Domain */}
                        <td style={inlineStyles.s59}>
                          <div style={inlineStyles.s60}>{org.name}</div>
                          <div style={inlineStyles.s61}>{org.domain}</div>
                        </td>

                        {/* Plan */}
                        <td style={inlineStyles.s62}>
                          <span style={featureStyleFunctions.s6({org})}>
                            {org.plan}
                          </span>
                        </td>

                        {/* Student Seats Progress */}
                        <td style={inlineStyles.s63}>
                          <div style={inlineStyles.s64}>
                            {org.seats_used || 0} / {org.max_seats || 500}
                          </div>
                          <div style={inlineStyles.s65}>
                            <div style={featureStyleFunctions.s7({seatPct})} />
                          </div>
                        </td>

                        {/* Voice Usage Progress */}
                        <td style={inlineStyles.s66}>
                          <div style={inlineStyles.s67}>
                            {(org.voice_minutes_used || 0).toLocaleString()} / {(org.voice_minutes_limit || 0).toLocaleString()} mins
                          </div>
                          <div style={inlineStyles.s68}>
                            <div style={featureStyleFunctions.s8({voicePct})} />
                          </div>
                        </td>

                        {/* Primary Admin */}
                        <td style={inlineStyles.s69}>
                          <div style={inlineStyles.s70}>{org.admin_name || 'Admin'}</div>
                          <div style={inlineStyles.s71}>{org.admin_email}</div>
                        </td>

                        {/* Status Toggle Button */}
                        <td style={inlineStyles.s72}>
                          <button
                            onClick={() => handleToggleStatus(org)}
                            style={featureStyleFunctions.s9({isSuspended})}
                            title={`Click to ${isSuspended ? 'Activate' : 'Suspend'} organization`}
                          >
                            <span style={featureStyleFunctions.s10({isSuspended})} />
                            <span>{isSuspended ? 'Suspended' : 'Active'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={inlineStyles.s73}>
                          <div style={inlineStyles.s74}>
                            {/* Impersonate / View as Org */}
                            <button
                              onClick={() => handleImpersonate(org)}
                              style={inlineStyles.s75}
                              title="Login to this organization as administrator to troubleshoot"
                            >
                              <ExternalLink size={12} />
                              <span>View as Org</span>
                            </button>

                            {/* Edit Quotas */}
                            <button
                              onClick={() => setEditingOrg({ ...org })}
                              style={inlineStyles.s76}
                              title="Edit seat and AI quota limits"
                            >
                              <Settings size={12} />
                              <span>Quotas</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: AI & VOICE USAGE METERING ── */}
      {activeTab === 'metering' && (
        <div style={inlineStyles.s77}>
          <div style={inlineStyles.s78}>
            <h3 style={inlineStyles.s79}>
              Gemini Live Voice & LLM Token Billing Breakdown
            </h3>
            <p style={inlineStyles.s80}>
              Real-time consumption tracking across all client schools and universities. Use these metrics for invoicing and API quota enforcement.
            </p>

            <div style={inlineStyles.s81}>
              {organizations.map(org => {
                const voiceUsed = org.voice_minutes_used || 0;
                const voiceLimit = org.voice_minutes_limit || 1;
                const voicePct = Math.min(100, Math.round((voiceUsed / voiceLimit) * 100));

                const tokensUsed = org.tokens_used || 0;
                const tokensLimit = org.tokens_limit || 1;
                const tokensPct = Math.min(100, Math.round((tokensUsed / tokensLimit) * 100));

                return (
                  <div key={org.id} style={inlineStyles.s82}>
                    <div style={inlineStyles.s83}>
                      <div>
                        <div style={inlineStyles.s84}>{org.name}</div>
                        <div style={inlineStyles.s85}>{org.domain}</div>
                      </div>
                      <span style={inlineStyles.s86}>
                        {org.plan}
                      </span>
                    </div>

                    {/* Voice Minutes Bar */}
                    <div style={inlineStyles.s87}>
                      <div style={inlineStyles.s88}>
                        <span style={inlineStyles.s89}>
                          <Mic size={12} color="#10B981" /> Voice Minutes
                        </span>
                        <span style={inlineStyles.s90}>{voiceUsed.toLocaleString()} / {voiceLimit.toLocaleString()} ({voicePct}%)</span>
                      </div>
                      <div style={inlineStyles.s91}>
                        <div style={featureStyleFunctions.s11({voicePct})} />
                      </div>
                    </div>

                    {/* Tokens Bar */}
                    <div>
                      <div style={inlineStyles.s92}>
                        <span style={inlineStyles.s93}>
                          <Activity size={12} color="#F59E0B" /> LLM Tokens
                        </span>
                        <span style={inlineStyles.s94}>{(tokensUsed / 1000000).toFixed(2)}M / {(tokensLimit / 1000000).toFixed(0)}M ({tokensPct}%)</span>
                      </div>
                      <div style={inlineStyles.s95}>
                        <div style={featureStyleFunctions.s12({tokensPct})} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: INSTITUTION ADMINS DIRECTORY ── */}
      {activeTab === 'admins' && (
        <div style={inlineStyles.s96}>
          <div style={inlineStyles.s97}>
            <table style={inlineStyles.s98}>
              <thead>
                <tr style={inlineStyles.s99}>
                  <th style={inlineStyles.s100}>ADMINISTRATOR</th>
                  <th style={inlineStyles.s101}>ORGANISATION</th>
                  <th style={inlineStyles.s102}>ROLE</th>
                  <th style={inlineStyles.s103}>LAST LOGIN</th>
                  <th style={inlineStyles.s104}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(admin => {
                  const org = organizations.find(o => o.id === admin.org_id);
                  return (
                    <tr key={admin.id} style={inlineStyles.s105}>
                      <td style={inlineStyles.s106}>
                        <div style={inlineStyles.s107}>{admin.name}</div>
                        <div style={inlineStyles.s108}>{admin.email}</div>
                      </td>
                      <td style={inlineStyles.s109}>
                        {org?.name || admin.org_id}
                      </td>
                      <td style={inlineStyles.s110}>
                        {admin.role}
                      </td>
                      <td style={inlineStyles.s111}>
                        {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}
                      </td>
                      <td style={inlineStyles.s112}>
                        <button
                          onClick={() => org && handleImpersonate(org)}
                          style={inlineStyles.s113}
                        >
                          Impersonate
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: PLATFORM HEALTH & AUDIT TRAIL ── */}
      {activeTab === 'health' && (
        <div style={inlineStyles.s114}>
          {/* Health Grid */}
          <div style={inlineStyles.s115}>
            {/* Redis */}
            <div style={inlineStyles.s116}>
              <div style={inlineStyles.s117}>
                <Database size={20} color="#10B981" />
                <span style={inlineStyles.s118}>Upstash Redis Distributed Cache</span>
              </div>
              <div style={inlineStyles.s119}>
                Status: <strong style={inlineStyles.s120}>{health?.redis?.status || 'Online'}</strong><br />
                Round-Trip Latency: <strong>{health?.redis?.latencyMs || 42}ms</strong><br />
                Scope: Session caching, sliding memory & multi-tenant state
              </div>
            </div>

            {/* Voice WebSocket */}
            <div style={inlineStyles.s121}>
              <div style={inlineStyles.s122}>
                <Wifi size={20} color="#A855F7" />
                <span style={inlineStyles.s123}>Gemini Live Voice Server</span>
              </div>
              <div style={inlineStyles.s124}>
                Primary Port: <strong>5001</strong><br />
                Fallback Server: <strong>Port 3000 (server-with-ws.js)</strong><br />
                Protocol: 16kHz PCM input / 24kHz gapless Web Audio output
              </div>
            </div>

            {/* Next.js Core API Gateway */}
            <div style={inlineStyles.s125}>
              <div style={inlineStyles.s126}>
                <Server size={20} color="#3B82F6" />
                <span style={inlineStyles.s127}>Next.js Core API Gateway</span>
              </div>
              <div style={inlineStyles.s128}>
                Auth Protection: <strong>HMAC-SHA256 Timing-Safe JWT</strong><br />
                Tenant Isolation: <strong>Active (organization_id RLS)</strong><br />
                Runtime: Node.js 18+ App Router
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div style={inlineStyles.s129}>
            <h4 style={inlineStyles.s130}>
              Security & Administrative Audit Trail
            </h4>
            <div style={inlineStyles.s131}>
              {auditLogs.map(log => (
                <div key={log.id} style={inlineStyles.s132}>
                  <div style={inlineStyles.s133}>
                    <span style={inlineStyles.s134}>
                      {log.action}
                    </span>
                    <span style={inlineStyles.s135}>{log.target}</span>
                    <span style={inlineStyles.s136}>&middot; {log.details}</span>
                  </div>
                  <div style={inlineStyles.s137}>
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE NEW ORGANISATION ── */}
      {showCreateModal && (
        <div style={inlineStyles.s138}>
          <div style={inlineStyles.s139}>
            <h3 style={inlineStyles.s140}>
              Provision New Client Organisation
            </h3>
            <p style={inlineStyles.s141}>
              Configure institution profile, tenant subdomain, student seat quotas, and voice AI allocations.
            </p>

            <form onSubmit={handleCreateOrg} style={inlineStyles.s142}>
              <div>
                <label style={inlineStyles.s143}>INSTITUTION NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford School of Engineering"
                  value={newOrgForm.name}
                  onChange={e => setNewOrgForm({ ...newOrgForm, name: e.target.value })}
                  style={inlineStyles.s144}
                />
              </div>

              <div style={inlineStyles.s145}>
                <div>
                  <label style={inlineStyles.s146}>SUBDOMAIN SLUG</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. stanford"
                    value={newOrgForm.slug}
                    onChange={e => setNewOrgForm({ ...newOrgForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    style={inlineStyles.s147}
                  />
                </div>

                <div>
                  <label style={inlineStyles.s148}>TIER PLAN</label>
                  <select
                    value={newOrgForm.plan}
                    onChange={e => setNewOrgForm({ ...newOrgForm, plan: e.target.value })}
                    style={inlineStyles.s149}
                  >
                    <option value="starter">Starter (Trial)</option>
                    <option value="pro">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div style={inlineStyles.s150}>
                <div>
                  <label style={inlineStyles.s151}>STUDENT SEATS</label>
                  <input
                    type="number"
                    min="10"
                    max="100000"
                    value={newOrgForm.max_seats}
                    onChange={e => setNewOrgForm({ ...newOrgForm, max_seats: parseInt(e.target.value, 10) })}
                    style={inlineStyles.s152}
                  />
                </div>

                <div>
                  <label style={inlineStyles.s153}>MONTHLY VOICE MINUTES</label>
                  <input
                    type="number"
                    min="100"
                    max="1000000"
                    value={newOrgForm.voice_minutes_limit}
                    onChange={e => setNewOrgForm({ ...newOrgForm, voice_minutes_limit: parseInt(e.target.value, 10) })}
                    style={inlineStyles.s154}
                  />
                </div>
              </div>

              <div style={inlineStyles.s155}>
                <div>
                  <label style={inlineStyles.s156}>ADMIN FULL NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. John Doe"
                    value={newOrgForm.admin_name}
                    onChange={e => setNewOrgForm({ ...newOrgForm, admin_name: e.target.value })}
                    style={inlineStyles.s157}
                  />
                </div>

                <div>
                  <label style={inlineStyles.s158}>ADMIN EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="dean@stanford.edu"
                    value={newOrgForm.admin_email}
                    onChange={e => setNewOrgForm({ ...newOrgForm, admin_email: e.target.value })}
                    style={inlineStyles.s159}
                  />
                </div>
              </div>

              <div style={inlineStyles.s160}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={inlineStyles.s161}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={inlineStyles.s162}
                >
                  Provision Organisation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT QUOTAS ── */}
      {editingOrg && (
        <div style={inlineStyles.s163}>
          <div style={inlineStyles.s164}>
            <h3 style={inlineStyles.s165}>
              Adjust Quotas: {editingOrg.name}
            </h3>
            <p style={inlineStyles.s166}>
              Modify student license seat allocations, monthly Gemini Voice minutes, and LLM token caps.
            </p>

            <form onSubmit={handleUpdateQuotas} style={inlineStyles.s167}>
              <div>
                <label style={inlineStyles.s168}>TIER PLAN</label>
                <select
                  value={editingOrg.plan}
                  onChange={e => setEditingOrg({ ...editingOrg, plan: e.target.value })}
                  style={inlineStyles.s169}
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label style={inlineStyles.s170}>STUDENT SEAT ALLOTMENT</label>
                <input
                  type="number"
                  min="10"
                  max="100000"
                  value={editingOrg.max_seats}
                  onChange={e => setEditingOrg({ ...editingOrg, max_seats: parseInt(e.target.value, 10) })}
                  style={inlineStyles.s171}
                />
              </div>

              <div>
                <label style={inlineStyles.s172}>MONTHLY VOICE MINUTES LIMIT</label>
                <input
                  type="number"
                  min="100"
                  max="1000000"
                  value={editingOrg.voice_minutes_limit}
                  onChange={e => setEditingOrg({ ...editingOrg, voice_minutes_limit: parseInt(e.target.value, 10) })}
                  style={inlineStyles.s173}
                />
              </div>

              <div style={inlineStyles.s174}>
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  style={inlineStyles.s175}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={inlineStyles.s176}
                >
                  Save Quotas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
