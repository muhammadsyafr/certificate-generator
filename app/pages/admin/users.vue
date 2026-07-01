<template>
  <div class="tp-root">
    <!-- TOP BAR -->
    <header class="tp-topbar">
      <NuxtLink to="/" class="tp-logo">
        <span class="tp-logo-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9.5" r="5.5" stroke="#F5521E" stroke-width="2" />
            <path d="M9 14l-2 7 5-3 5 3-2-7" stroke="#fff" stroke-width="2" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="tp-logo-text">Certif<span class="tp-logo-accent">y</span></span>
      </NuxtLink>

      <div class="tp-topbar-divider" />

      <nav class="tp-topbar-nav">
        <NuxtLink to="/templates" class="tp-tab">Templates</NuxtLink>
        <NuxtLink to="/templates/assets" class="tp-tab">Assets</NuxtLink>
        <NuxtLink to="/generate" class="tp-tab">Generate</NuxtLink>
        <NuxtLink to="/admin/users" class="tp-tab tp-tab--active">Admin</NuxtLink>
      </nav>

      <div class="tp-topbar-actions">
        <div v-if="currentUser" class="tp-plan-badge">
          {{ currentUser.plan === 'pro' ? 'Pro' : 'Free' }} plan
          <a v-if="currentUser.plan !== 'pro'" href="/#pricing" class="tp-plan-upgrade">Upgrade</a>
        </div>
        <SharedUserMenu />
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="tp-content">
      <div class="page-container">
        <header class="page-header">
          <h1 class="page-title">User Management</h1>
          <p class="page-desc">Manage user accounts and permissions</p>
        </header>

        <!-- Loading State -->
        <div v-if="loading" class="empty-state">
          <div class="spinner"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-card">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>{{ error }}</p>
        </div>

        <!-- Users Table -->
        <div v-else class="users-card">
          <div class="users-table-wrap">
            <table class="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th class="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.uuid">
                  <td class="user-cell">
                    <div class="user-avatar">{{ getUserInitials(user.name) }}</div>
                    <div class="user-name">{{ user.name }}</div>
                  </td>
                  <td class="email-cell">{{ user.email }}</td>
                  <td>
                    <span v-if="user.isAdmin" class="badge badge-admin">Admin</span>
                    <span v-else class="badge badge-user">User</span>
                  </td>
                  <td>
                    <span v-if="user.plan === 'pro'" class="badge badge-pro">Pro</span>
                    <span v-else class="badge badge-free">Free</span>
                  </td>
                  <td>
                    <span v-if="isLocked(user)" class="badge badge-locked">Locked</span>
                    <span v-else class="badge badge-active">Active</span>
                  </td>
                  <td class="date-cell">{{ formatDate(user.createdAt) }}</td>
                  <td class="actions-cell">
                    <button
                      v-if="!user.isAdmin && !isSelf(user)"
                      @click="toggleAdmin(user, true)"
                      class="action-btn action-btn--promote"
                      title="Make Admin"
                    >
                      Promote
                    </button>
                    <button
                      v-if="user.isAdmin && !isSelf(user)"
                      @click="toggleAdmin(user, false)"
                      class="action-btn action-btn--demote"
                      title="Remove Admin"
                    >
                      Demote
                    </button>
                    <button
                      v-if="user.plan === 'free' && !isSelf(user)"
                      @click="changePlan(user, 'pro')"
                      class="action-btn action-btn--upgrade"
                      title="Upgrade to Pro"
                    >
                      Upgrade
                    </button>
                    <button
                      v-if="user.plan === 'pro' && !isSelf(user)"
                      @click="changePlan(user, 'free')"
                      class="action-btn action-btn--downgrade"
                      title="Downgrade to Free"
                    >
                      Downgrade
                    </button>
                    <button
                      v-if="isLocked(user)"
                      @click="unlockAccount(user)"
                      class="action-btn action-btn--unlock"
                      title="Unlock Account"
                    >
                      Unlock
                    </button>
                    <button
                      v-if="!isSelf(user)"
                      @click="confirmDelete(user)"
                      class="action-btn action-btn--delete"
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal-fade">
      <div v-if="deleteModal.show" class="modal-overlay" @click="deleteModal.show = false">
        <div class="modal-panel modal-panel--delete" @click.stop>
          <div class="modal-icon modal-icon--danger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="modal-title">Delete User</h3>
          <p class="modal-desc">
            Are you sure you want to delete <strong>{{ deleteModal.user?.name }}</strong>? This action cannot be undone.
          </p>
          <div class="modal-actions">
            <button @click="deleteModal.show = false" class="btn-ghost">Cancel</button>
            <button @click="deleteUser(deleteModal.user)" class="btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: false
})

const { get, put, del } = useApi()
const { user: currentUser, loadUser } = useAuth()

interface User {
  uuid: string
  email: string
  name: string
  isAdmin: boolean
  plan: string
  failedLoginAttempts: number
  lockedUntil: string | null
  createdAt: string
}

const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')
const deleteModal = ref({
  show: false,
  user: null as User | null
})

const loadUsers = async () => {
  try {
    loading.value = true
    error.value = ''
    const data = await get('/api/admin/users')
    users.value = data
  } catch (err: any) {
    error.value = err.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const toggleAdmin = async (user: User, makeAdmin: boolean) => {
  try {
    await put(`/api/admin/users/${user.uuid}`, { isAdmin: makeAdmin })
    user.isAdmin = makeAdmin
  } catch (err: any) {
    alert(err.message || 'Failed to update user')
  }
}

const changePlan = async (user: User, newPlan: string) => {
  try {
    await put(`/api/admin/users/${user.uuid}`, { plan: newPlan })
    user.plan = newPlan
  } catch (err: any) {
    alert(err.message || 'Failed to change plan')
  }
}

const unlockAccount = async (user: User) => {
  try {
    await put(`/api/admin/users/${user.uuid}`, { unlock: true })
    user.lockedUntil = null
    user.failedLoginAttempts = 0
  } catch (err: any) {
    alert(err.message || 'Failed to unlock account')
  }
}

const confirmDelete = (user: User) => {
  deleteModal.value = {
    show: true,
    user
  }
}

const deleteUser = async (user: User | null) => {
  if (!user) return
  
  try {
    await del(`/api/admin/users/${user.uuid}`)
    users.value = users.value.filter(u => u.uuid !== user.uuid)
    deleteModal.value.show = false
  } catch (err: any) {
    alert(err.message || 'Failed to delete user')
  }
}

const isSelf = (user: User) => user.uuid === currentUser.value?.uuid || user.uuid === currentUser.value?.id

const isLocked = (user: User) => {
  if (!user.lockedUntil) return false
  return new Date(user.lockedUntil) > new Date()
}

const getUserInitials = (name: string) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(async () => {
  await loadUser()
  loadUsers()
})
</script>

<style scoped>
/* Root Layout */
.tp-root {
  min-height: 100vh;
  background: #f4f4f5;
  display: flex;
  flex-direction: column;
}

/* Top Bar - Matches templates page */
.tp-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(244, 244, 245, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #d4d4d8;
  height: 58px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 16px;
}

.tp-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.tp-logo-mark {
  width: 32px;
  height: 32px;
  background: #09090b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tp-logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #09090b;
  letter-spacing: -0.02em;
}

.tp-logo-accent {
  color: #f5521e;
}

.tp-topbar-divider {
  width: 1px;
  height: 20px;
  background: #d4d4d8;
}

.tp-topbar-nav {
  display: flex;
  gap: 4px;
  flex: 1;
}

.tp-tab {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #52525b;
  text-decoration: none;
  transition: all 150ms ease;
}

.tp-tab:hover {
  color: #09090b;
  background: rgba(9, 9, 11, 0.04);
}

.tp-tab--active {
  color: #09090b;
  background: rgba(9, 9, 11, 0.08);
}

.tp-topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tp-plan-badge {
  font-size: 12px;
  color: #52525b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tp-plan-upgrade {
  color: #f5521e;
  font-weight: 600;
  text-decoration: none;
}

.tp-plan-upgrade:hover {
  text-decoration: underline;
}

/* Main Content */
.tp-content {
  flex: 1;
  padding: 32px 20px;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.12;
  margin-bottom: 8px;
  color: #09090b;
}

.page-desc {
  font-size: 16px;
  color: #52525b;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #ececee;
  border-top-color: #09090b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error Card */
.error-card {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ef4444;
  font-size: 14px;
}

.error-card svg {
  flex-shrink: 0;
}

/* Users Card */
.users-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.users-table-wrap {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.users-table thead {
  background: #fafafa;
  border-bottom: 1px solid #ececee;
}

.users-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-table th.actions-col {
  text-align: right;
}

.users-table tbody tr {
  border-bottom: 1px solid #f4f4f5;
  transition: background 150ms ease;
}

.users-table tbody tr:hover {
  background: #fafafa;
}

.users-table tbody tr:last-child {
  border-bottom: none;
}

.users-table td {
  padding: 16px;
  color: #09090b;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
}

.email-cell {
  color: #52525b;
}

.date-cell {
  color: #71717a;
  font-size: 13px;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.badge-admin {
  background: rgba(147, 51, 234, 0.12);
  color: #9333ea;
}

.badge-user {
  background: rgba(71, 71, 122, 0.12);
  color: #52525b;
}

.badge-active {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.badge-locked {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.badge-pro {
  background: rgba(255, 90, 0, 0.12);
  color: #f5521e;
}

.badge-free {
  background: rgba(161, 161, 170, 0.12);
  color: #71717a;
}

/* Action Buttons */
.actions-cell {
  text-align: right;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
  margin-left: 6px;
}

.action-btn--promote {
  background: rgba(147, 51, 234, 0.08);
  color: #9333ea;
}

.action-btn--promote:hover {
  background: rgba(147, 51, 234, 0.16);
}

.action-btn--demote {
  background: rgba(71, 71, 122, 0.08);
  color: #52525b;
}

.action-btn--demote:hover {
  background: rgba(71, 71, 122, 0.16);
}

.action-btn--unlock {
  background: rgba(34, 197, 94, 0.08);
  color: #16a34a;
}

.action-btn--unlock:hover {
  background: rgba(34, 197, 94, 0.16);
}

.action-btn--delete {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

.action-btn--delete:hover {
  background: rgba(239, 68, 68, 0.16);
}

.action-btn--upgrade {
  background: rgba(255, 90, 0, 0.08);
  color: #f5521e;
}

.action-btn--upgrade:hover {
  background: rgba(255, 90, 0, 0.16);
}

.action-btn--downgrade {
  background: rgba(161, 161, 170, 0.08);
  color: #71717a;
}

.action-btn--downgrade:hover {
  background: rgba(161, 161, 170, 0.16);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 17, 14, 0.44);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-panel {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: modal-in 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-panel--delete {
  text-align: center;
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.modal-icon--danger {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #09090b;
  margin-bottom: 12px;
}

.modal-desc {
  font-size: 14px;
  color: #52525b;
  line-height: 1.5;
  margin-bottom: 24px;
}

.modal-desc strong {
  color: #09090b;
  font-weight: 600;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* Button Styles */
.btn-ghost {
  background: transparent;
  color: #52525b;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
  border: none;
}

.btn-ghost:hover {
  color: #09090b;
  background: #ececee;
}

.btn-danger {
  background: #ef4444;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
  border: none;
}

.btn-danger:hover {
  background: #dc2626;
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 200ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from .modal-panel {
  transform: scale(0.96) translateY(10px);
}

.modal-fade-leave-to .modal-panel {
  transform: scale(0.96) translateY(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .tp-topbar {
    padding: 0 16px;
  }

  .tp-topbar-nav {
    display: none;
  }

  .tp-content {
    padding: 24px 16px;
  }

  .page-title {
    font-size: 32px;
  }

  .users-table th,
  .users-table td {
    padding: 12px;
  }

  .action-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
