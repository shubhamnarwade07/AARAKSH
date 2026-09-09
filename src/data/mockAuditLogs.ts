import { AuditLog, UserRole } from '@/types';

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'LOG_001', userId: 'USR_003', userName: 'System Admin', userRole: 'ADMIN', action: 'LOGIN', resource: 'AUTH', status: 'SUCCESS', timestamp: new Date(Date.now() - 120000).toISOString(), ipAddress: '10.0.0.1' },
  { id: 'LOG_002', userId: 'USR_002', userName: 'Authority Officer', userRole: 'AUTHORITY', action: 'ACKNOWLEDGE_ALERT', resource: 'ALERT', resourceId: 'ALT_003', status: 'SUCCESS', timestamp: new Date(Date.now() - 1200000).toISOString(), ipAddress: '10.0.0.5' },
  { id: 'LOG_003', userId: 'USR_001', userName: 'Demo User', userRole: 'USER', action: 'LOGIN', resource: 'AUTH', status: 'SUCCESS', timestamp: new Date(Date.now() - 1800000).toISOString(), ipAddress: '10.0.1.100' },
  { id: 'LOG_004', userId: 'USR_002', userName: 'Authority Officer', userRole: 'AUTHORITY', action: 'RESOLVE_ALERT', resource: 'ALERT', resourceId: 'ALT_005', status: 'SUCCESS', timestamp: new Date(Date.now() - 3600000).toISOString(), ipAddress: '10.0.0.5' },
  { id: 'LOG_005', userId: 'USR_003', userName: 'System Admin', userRole: 'ADMIN', action: 'VIEW_USERS', resource: 'USER', status: 'SUCCESS', timestamp: new Date(Date.now() - 7200000).toISOString(), ipAddress: '10.0.0.1' },
  { id: 'LOG_006', userId: 'USR_001', userName: 'Demo User', userRole: 'USER', action: 'LOGOUT', resource: 'AUTH', status: 'SUCCESS', timestamp: new Date(Date.now() - 86400000).toISOString(), ipAddress: '10.0.1.100' },
  { id: 'LOG_007', userId: 'USR_003', userName: 'System Admin', userRole: 'ADMIN', action: 'DEACTIVATE_USER', resource: 'USER', resourceId: 'USR_005', status: 'SUCCESS', timestamp: new Date(Date.now() - 172800000).toISOString(), ipAddress: '10.0.0.1' },
];
